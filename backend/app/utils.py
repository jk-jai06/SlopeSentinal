def determine_risk_level(probability: float) -> str:
    """
    Converts a probability threshold into business logic categorization.
    """
    if probability >= 0.75:
        return "High Risk"
    elif probability >= 0.40:
        return "Medium Risk"
    else:
        return "Low Risk"
