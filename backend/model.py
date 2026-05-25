import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.metrics import classification_report, roc_auc_score, accuracy_score
import shap
import pickle

df = pd.read_csv('data/heart.csv')
df.head()

#Fixing the zeroes
df['Cholesterol'] = df['Cholesterol'].replace(0, np.nan)
#Fixing the zero values in the resting blood pressure column
df['RestingBP'] = df['RestingBP'].replace(0, np.nan)

#Training and Testing Set
from sklearn.model_selection import train_test_split
X = df.drop('HeartDisease', axis=1)
y = df['HeartDisease']

Categorical_cols = X.select_dtypes(include='object').columns
Numerical_cols = X.select_dtypes(include=[np.number]).columns

#Fill in the missing values and scale the numerical features and encode the categorical features and combine them
numerical_pipeline = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler())
])

categorical_pipeline = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('encoder', OneHotEncoder(handle_unknown='ignore'))
])

preprocessor = ColumnTransformer(
    transformers=[
        ('num', numerical_pipeline, Numerical_cols),
        ('cat', categorical_pipeline, Categorical_cols)
    ])


X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
X_train_processed = preprocessor.fit_transform(X_train)
X_test_processed = preprocessor.transform(X_test)

feature_names = list(Numerical_cols) + list(
    preprocessor.named_transformers_["cat"]
    .named_steps["encoder"]
    .get_feature_names_out(Categorical_cols)
)
X_train_df = pd.DataFrame(X_train_processed, columns=feature_names)
X_test_df = pd.DataFrame(X_test_processed, columns=feature_names)

#Modeling
Models = {
    'Logistic Regression': LogisticRegression(),
    'Random Forest': RandomForestClassifier(),
    'XGBoost': XGBClassifier()
}

for name, model in Models.items():
    model.fit(X_train_processed, y_train)
    y_pred = model.predict(X_test_processed)
    y_prob = model.predict_proba(X_test_processed)[:, 1]
    print(f"\n{'='*40}")
    print(f"{name}")
    print(f"{'='*40}")
    print(classification_report(y_test, y_pred))
    print(f"ROC-AUC: {roc_auc_score(y_test, y_prob):.4f}")

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

for name, model in Models.items():
    scores = cross_val_score(model, X_train_processed, y_train,cv=cv, scoring='roc_auc')
    print(f"{name}: CV AUC = {scores.mean():.4f} (+/- {scores.std():.4f})")


#WE made the inference that XGBoost is the most consistent model, so we will use it for the final model
#However the best avg predictor is random forest

best_model=Models['XGBoost']
pickle.dump(best_model, open('models/xgb_model.pkl', 'wb'))
pickle.dump(preprocessor, open('models/preprocessor.pkl', 'wb'))
print("Models saved.")


explainer = shap.Explainer(best_model, X_train_processed)
shap_values = explainer.shap_values(X_train_processed)
shap.summary_plot(shap_values, X_train_df)