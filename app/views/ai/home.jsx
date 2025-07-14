import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  Platform,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRouter } from "expo-router"; // Assuming you are using Expo Router
import { COLORS } from "../../../constants/helper"; // Adjust path as needed

const { width } = Dimensions.get("window");

// Define the AI features with icons and descriptions
const AI_FEATURES = [
  // Health Tracking & Analysis
  {
    id: "symptom_checker",
    name: "Symptom Checker",
    icon: "medical-bag",
    description: "Analyze symptoms & suggest possible conditions.",
    category: "Health Analysis",
    path: "views/ai/HealthAnalysis/SymptomChecker",
  },
  {
    id: "medication_reminders",
    name: "Medication Reminders",
    icon: "pill",
    description: "Set smart reminders for your medications.",
    category: "Health Tracking",
    path: "views/ai/HealthTracking/MedicationReminder",
  },
  {
    id: "nutrition_analysis",
    name: "Nutrition Analysis",
    icon: "food-apple-outline",
    description: "Analyze your diet and get nutritional insights.",
    category: "Health Analysis",
    path: "views/ai/HealthAnalysis/NutritionAnalysis",
  },
  {
    id: "fitness_goal_setter",
    name: "Fitness Goal Setter",
    icon: "run-fast",
    description: "Create personalized workout plans.",
    category: "Personalized Tools",
    path: "views/ai/PersonalizeTools/FitnessGoalSetter",
  },
  {
    id: "skin_condition_analyzer",
    name: "Skin AI Analysis",
    icon: "face-mask-outline",
    description:
      "Upload skin images for AI-powered analysis of potential conditions.",
    category: "Health Analysis",
    path: "views/ai/HealthAnalysis/SkinAnalysis",
  },
  {
    id: "ecg_analysis",
    name: "ECG Analysis",
    icon: "heart-plus",
    description: "AI-powered ECG interpretation from wearable data.",
    category: "Advanced Monitoring",
    path: "views/ai/AdvancedMonitoring/ECGAnalysis",
    premium: true,
    realTime: true,
  },
  {
    id: "respiratory_analysis",
    name: "Respiratory Analysis",
    icon: "lungs",
    description: "Monitor breathing patterns and detect abnormalities.",
    category: "Advanced Monitoring",
    path: "views/ai/AdvancedMonitoring/RespiratoryAnalysis",
  },
  {
    id: "sleep_tracker_analysis",
    name: "Sleep Analysis",
    icon: "sleep",
    description: "Interpret sleep data for better rest.",
    category: "Health Analysis",
    path: "views/ai/HealthAnalysis/SleepAnalysis",
  },
  {
    id: "stress_level_monitor",
    name: "Stress Monitor",
    icon: "emoticon-sad-outline",
    description: "Track stress levels and coping mechanisms.",
    category: "Health Tracking",
    path: "views/ai/HealthTracking/StressMonitor",
  },
  {
    id: "bp_log_analysis",
    name: "BP Log & Analysis",
    icon: "heart-pulse",
    description: "Log blood pressure and get trend analysis.",
    category: "Health Tracking",
    path: "views/ai/HealthTracking/BPLogAnalysis",
  },
  {
    id: "blood_sugar_analysis",
    name: "Blood Sugar Analysis",
    icon: "diabetes",
    description: "Track blood sugar and identify patterns.",
    category: "Health Tracking",
    path: "views/ai/HealthTracking/BloodSugar",
  },

  // Consultation & Information
  {
    id: "ai_doctor_chat",
    name: "AI Doctor Chat",
    icon: "chat-processing-outline",
    description: "Ask health questions and get instant answers.",
    category: "Consultation",
    path: "views/ai/Consultation/AIDoctor",
  },
  {
    id: "medical_terminology",
    name: "Medical Terminology",
    icon: "book-open-outline",
    description: "Understand complex medical terms easily.",
    category: "Information",
    path: "views/ai/Information/MedicalTerminology",
  },
  {
    id: "drug_interaction_checker",
    name: "Drug Interaction",
    icon: "pill",
    description: "Check for potential drug interactions.",
    category: "Information",
    path: "views/ai/Information/DrugInteraction",
  },
  {
    id: "disease_lookup",
    name: "Disease Information",
    icon: "virus-outline",
    description: "Access comprehensive disease information.",
    category: "Information",
    path: "views/ai/Information/DiseaseInformation",
  },
  {
    id: "first_aid_guide",
    name: "First Aid Guide",
    icon: "bandage",
    description: "Quick guide for emergency situations.",
    category: "Information",
    path: "views/ai/Information/FirstAidGuide",
  },
  {
    id: "mental_health_support",
    name: "Mental Health Support",
    icon: "brain",
    description: "AI-guided exercises for mental well-being.",
    category: "Consultation",
    path: "views/ai/Consultation/MentalHealth",
  },

  // Personalized Tools
  {
    id: "custom_workout_generator",
    name: "Custom Workouts",
    icon: "dumbbell",
    description: "Generate workout routines based on your needs.",
    category: "Personalized Tools",
    path: "views/ai/PersonalizeTools/CustomWorkout",
  },
  {
    id: "meal_plan_generator",
    name: "Meal Plan Generator",
    icon: "silverware-fork-knife",
    description: "Create personalized healthy meal plans.",
    category: "Personalized Tools",
    path: "views/ai/PersonalizeTools/MealPlan",
  },
  {
    id: "recipe_health_analyzer",
    name: "Recipe Analyzer",
    icon: "chef-hat",
    description: "Analyze recipes for nutritional value.",
    category: "Personalized Tools",
    path: "views/ai/PersonalizeTools/RecipeAnalyzer",
  },
  {
    id: "health_risk_assessment",
    name: "Health Risk Assessment",
    icon: "alert-octagon-outline",
    description: "Assess your health risks and get advice.",
    category: "Health Analysis",
    path: "views/ai/HealthAnalysis/HealthRisk",
  },
  {
    id: "wellness_tips",
    name: "Wellness Tips",
    icon: "lightbulb-on-outline",
    description: "Receive daily wellness tips & articles.",
    category: "Information",
    path: "views/ai/Information/WellnessTips",
  },
  {
    id: "lab_result_interpreter",
    name: "Lab Result Interpreter",
    icon: "microscope",
    description: "Understand your lab results with AI.",
    category: "Health Analysis",
    path: "views/ai/HealthAnalysis/LabResult",
  },
  {
    id: "health_report_generator",
    name: "Health Report",
    icon: "file-chart-outline",
    description: "Generate comprehensive personalized health reports.",
    category: "Health Analysis",
    path: "views/ai/HealthAnalysis/HealthReport",
  },
];

const AIHomeScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const router = useRouter();
  // Group features by category
  const categorizedFeatures = AI_FEATURES.reduce((acc, feature) => {
    if (!acc[feature.category]) {
      acc[feature.category] = [];
    }
    acc[feature.category].push(feature);
    return acc;
  }, {});

  const handleFeaturePress = (path) => {
    router.push(`${path}`);
  };

  return (
    <View style={styles.container}>
      {/* Gradient Header */}
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerGradient}
      >
        <View style={[styles.headerContent, { paddingTop: insets.top }]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerButton}
          >
            <Ionicons name="chevron-back" size={28} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>AI Health Assistant</Text>
          <View style={{ width: 28 }} />
        </View>
        <Text style={styles.headerSubtitle}>Your Smart Health Companion</Text>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollViewContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
      >
        {Object.keys(categorizedFeatures).map((category) => (
          <View key={category} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{category}</Text>
            <View style={styles.featuresGrid}>
              {categorizedFeatures[category].map((feature) => (
                <TouchableOpacity
                  key={feature.id}
                  style={styles.featureCard}
                  onPress={() => handleFeaturePress(feature.path)}
                >
                  <MaterialCommunityIcons
                    name={feature.icon}
                    size={40}
                    color={COLORS.primary}
                    style={styles.featureIcon}
                  />
                  <Text style={styles.featureName}>{feature.name}</Text>
                  <Text style={styles.featureDescription}>
                    {feature.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerGradient: {
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  headerButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.white,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.white,
    textAlign: "center",
    marginBottom: 15,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  categorySection: {
    marginBottom: 30,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 15,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureCard: {
    width: (width - 40 - 20) / 2, // (screen_width - horizontal_padding*2 - gap_between_cards) / 2
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  featureIcon: {
    marginBottom: 10,
  },
  featureName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 18,
  },
});

export default AIHomeScreen;
