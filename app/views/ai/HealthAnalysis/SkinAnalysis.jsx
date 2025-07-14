import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  Button,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { COLORS } from "../../../../constants/helper"; 
import useGeminiApi from "../../../../lib/useGeminiApi"; 

const { width, height } = Dimensions.get("window");

const SkinAnalysisScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const cameraRef = useRef(null);

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [aiAnalysisResult, setAiAnalysisResult] = useState(null);
  const [previousAnalyses, setPreviousAnalyses] = useState([]);

  const [cameraFacing, setCameraFacing] = useState("back");

  const {
    response: aiResponse,
    loading: aiLoading,
    error: aiError,
    generateContent: generateAiContent,
  } = useGeminiApi();

  useEffect(() => {
    (async () => {
      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === "granted");
    })();
  }, []);

  useEffect(() => {
    if (aiResponse) {
      setAiAnalysisResult(aiResponse);
      setPreviousAnalyses((prev) => [
        {
          id: Date.now(),
          imageUri: capturedImage,
          result: aiResponse,
          timestamp: new Date().toLocaleString(),
        },
        ...prev,
      ]);
    }
    if (aiError) {
      Alert.alert("AI Analysis Error", aiError);
    }
  }, [aiResponse, aiError]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const startCamera = async () => {
    if (!cameraPermission || !cameraPermission.granted) {
      const { status } = await requestCameraPermission();
      if (status !== "granted") {
        Alert.alert(
          "Camera Permission Required",
          "Please grant camera access in your device settings to use this feature."
        );
        return;
      }
    }
    setIsCameraActive(true);
    setCapturedImage(null);
    setAiAnalysisResult(null);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.7,
          base64: true,
        });
        setCapturedImage(photo.uri);
        setIsCameraActive(false);
        setAiAnalysisResult(null);

        const prompt = `Analyze this skin image for potential conditions. Provide a concise, general overview of what the image might indicate (e.g., "dry skin," "minor irritation," or "normal skin"). Do not provide medical diagnosis or advice.`;
        generateAiContent(prompt, photo.base64);
      } catch (error) {
        console.error("Failed to take picture:", error);
        Alert.alert("Error", "Could not take picture. Please try again.");
      }
    }
  };

  const pickImage = async () => {
    if (hasGalleryPermission === false) {
      Alert.alert(
        "Gallery Permission Required",
        "Please grant gallery access in your device settings to use this feature."
      );
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled) {
      setCapturedImage(result.assets[0].uri);
      setIsCameraActive(false);
      setAiAnalysisResult(null);
      const prompt = `Analyze this skin image for potential conditions. Provide a concise, general overview of what the image might indicate (e.g., "dry skin," "minor irritation," or "normal skin"). Do not provide medical diagnosis or advice.`;
      generateAiContent(prompt, result.assets[0].base64);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setAiAnalysisResult(null);
    setIsCameraActive(true);
  };

  const toggleCameraFacing = () => {
    setCameraFacing((prevFacing) => (prevFacing === "back" ? "front" : "back"));
  };

  if (cameraPermission === null || hasGalleryPermission === null) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.permissionText}>Requesting permissions...</Text>
      </View>
    );
  }
  if (!cameraPermission.granted || hasGalleryPermission === false) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.permissionText}>
          We need your permission to show the camera and access your photo
          gallery.
        </Text>
        {!cameraPermission.granted && (
          <Button
            onPress={requestCameraPermission}
            title="Grant Camera Permission"
          />
        )}
        {hasGalleryPermission === false && (
          <TouchableOpacity
            style={styles.enablePermissionButton}
            onPress={() => {
              Alert.alert(
                "Enable Permissions",
                "Please manually enable camera and media library permissions in your phone's settings for this app."
              );
            }}
          >
            <Text style={styles.enablePermissionButtonText}>
              Go to Settings
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerGradient}
      >
        <View style={[styles.headerContent, { paddingTop: insets.top }]}>
          <TouchableOpacity
            onPress={handleBackPress}
            style={styles.headerButton}
          >
            <Ionicons name="chevron-back" size={28} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Skin AI Analysis</Text>
          <View style={{ width: 28 }} />
        </View>
        <Text style={styles.headerSubtitle}>
          Upload or capture images for AI skin analysis
        </Text>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollViewContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
      >
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Capture or Select Image</Text>

          {!isCameraActive && !capturedImage && (
            <View style={styles.initialPromptContainer}>
              <MaterialCommunityIcons
                name="face-mask-outline"
                size={80}
                color={COLORS.textSecondary}
                style={{ opacity: 0.5 }}
              />
              <Text style={styles.initialPromptText}>
                Take a photo or choose from gallery to analyze your skin.
              </Text>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={startCamera}
              >
                <Ionicons
                  name="camera-outline"
                  size={24}
                  color={COLORS.white}
                />
                <Text style={styles.actionButtonText}>Open Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.galleryButton]}
                onPress={pickImage}
              >
                <Ionicons
                  name="images-outline"
                  size={24}
                  color={COLORS.primary}
                />
                <Text
                  style={[styles.actionButtonText, styles.galleryButtonText]}
                >
                  Choose from Gallery
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {isCameraActive && (
            <View style={styles.cameraContainer}>
              <CameraView
                style={styles.cameraPreview}
                ref={cameraRef}
                facing={cameraFacing}
              />
              {/* Overlay content rendered OUTSIDE CameraView but positioned absolutely */}
              <View style={styles.cameraOverlay}>
                <Text style={styles.cameraInstructions}>
                  Position the skin area clearly within the frame.
                </Text>
                <View style={styles.cameraControls}>
                  <TouchableOpacity
                    style={styles.flipCameraButton}
                    onPress={toggleCameraFacing}
                  >
                    <Ionicons
                      name="camera-reverse-outline"
                      size={30}
                      color={COLORS.white}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.captureButton}
                    onPress={takePicture}
                  >
                    <View style={styles.captureButtonInner} />
                  </TouchableOpacity>
                  <View style={{ width: 50 }} /> {/* Spacer */}
                </View>
              </View>
              <TouchableOpacity
                style={styles.cancelCameraButton}
                onPress={() => setIsCameraActive(false)}
              >
                <Text style={styles.cancelCameraButtonText}>Cancel Camera</Text>
              </TouchableOpacity>
            </View>
          )}

          {capturedImage && !isCameraActive && (
            <View style={styles.imagePreviewContainer}>
              <Image
                source={{ uri: capturedImage }}
                style={styles.capturedImage}
              />
              <View style={styles.imageActions}>
                <TouchableOpacity
                  style={styles.imageActionButton}
                  onPress={retakePhoto}
                >
                  <Ionicons
                    name="camera-reverse-outline"
                    size={24}
                    color={COLORS.primary}
                  />
                  <Text style={styles.imageActionButtonText}>Retake</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.imageActionButton}
                  onPress={pickImage}
                >
                  <Ionicons
                    name="folder-open-outline"
                    size={24}
                    color={COLORS.primary}
                  />
                  <Text style={styles.imageActionButtonText}>Change</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {capturedImage && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>AI Analysis Result</Text>
            {aiLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Analyzing image...</Text>
              </View>
            ) : aiError ? (
              <View style={styles.errorContainer}>
                <Ionicons
                  name="warning-outline"
                  size={24}
                  color={COLORS.error}
                />
                <Text style={styles.errorText}>{aiError}</Text>
              </View>
            ) : aiAnalysisResult ? (
              <View style={styles.analysisResultCard}>
                <Text style={styles.analysisResultTitle}>
                  Potential Indications:
                </Text>
                <Text style={styles.analysisResultText}>
                  {aiAnalysisResult}
                </Text>
                <Text style={styles.disclaimerText}>
                  *This AI analysis is for informational purposes only and is
                  not a substitute for professional medical advice.
                </Text>
              </View>
            ) : (
              <View style={styles.placeholderContainer}>
                <MaterialCommunityIcons
                  name="robot-outline"
                  size={60}
                  color={COLORS.textSecondary}
                  style={{ opacity: 0.6 }}
                />
                <Text style={styles.placeholderText}>
                  Upload an image to get AI insights.
                </Text>
              </View>
            )}
          </View>
        )}

        {previousAnalyses.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Previous Analyses</Text>
            {previousAnalyses.map((analysis) => (
              <View key={analysis.id} style={styles.previousAnalysisCard}>
                <Image
                  source={{ uri: analysis.imageUri }}
                  style={styles.previousAnalysisImage}
                />
                <View style={styles.previousAnalysisContent}>
                  <Text style={styles.previousAnalysisDate}>
                    {analysis.timestamp}
                  </Text>
                  <Text style={styles.previousAnalysisResult} numberOfLines={3}>
                    {analysis.result}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
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
  sectionContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1.5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 15,
  },
  permissionText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    padding: 20,
  },
  enablePermissionButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  enablePermissionButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },

  // Initial Prompt/Action Buttons
  initialPromptContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
    borderWidth: 1,
    borderColor: COLORS.separator,
    borderRadius: 10,
    backgroundColor: COLORS.background,
  },
  initialPromptText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 15,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  galleryButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
    shadowColor: COLORS.black,
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  galleryButtonText: {
    color: COLORS.primary,
  },

  // Camera Styles
  cameraContainer: {
    width: "100%",
    height: width * 0.75,
    borderRadius: 15,
    overflow: "hidden", // Essential for borderRadius to work on children
    backgroundColor: COLORS.black,
    marginBottom: 15,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    position: "relative", // Set parent to relative for absolute children
  },
  cameraPreview: {
    width: "100%",
    height: "100%",
    // No need for justifyContent/alignItems here, as overlay handles positioning
  },
  cameraOverlay: {
    position: "absolute", // Position this absolutely
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 20,
    backgroundColor: "rgba(0,0,0,0.1)", // Slight overlay to help readability of text
  },
  cameraInstructions: {
    color: COLORS.white,
    fontSize: 14,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginTop: 20,
  },
  cameraControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.8)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.white,
  },
  flipCameraButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelCameraButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: COLORS.lightBackground,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelCameraButtonText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },

  // Image Preview Styles
  imagePreviewContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  capturedImage: {
    width: "100%",
    height: width * 0.75,
    borderRadius: 15,
    resizeMode: "cover",
    borderWidth: 1,
    borderColor: COLORS.separator,
  },
  imageActions: {
    flexDirection: "row",
    marginTop: 15,
    width: "80%",
    justifyContent: "space-around",
  },
  imageActionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  imageActionButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
  },

  // AI Analysis Result Styles
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.error + "20",
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  errorText: {
    marginLeft: 10,
    fontSize: 14,
    color: COLORS.error,
    flexShrink: 1,
  },
  analysisResultCard: {
    backgroundColor: COLORS.lightBackground,
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.separator,
  },
  analysisResultTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  analysisResultText: {
    fontSize: 15,
    color: COLORS.textPrimary,
    lineHeight: 22,
  },
  disclaimerText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 10,
    fontStyle: "italic",
    textAlign: "center",
  },
  placeholderContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.separator,
  },
  placeholderText: {
    marginTop: 15,
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    opacity: 0.7,
  },

  // Previous Analyses Styles
  previousAnalysisCard: {
    flexDirection: "row",
    backgroundColor: COLORS.lightBackground,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.separator,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 0.8,
  },
  previousAnalysisImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
    resizeMode: "cover",
  },
  previousAnalysisContent: {
    flex: 1,
  },
  previousAnalysisDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  previousAnalysisResult: {
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 18,
  },
});

export default SkinAnalysisScreen;
