// app/chat/detail.js (or app/chat-detail-screen.js)
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../../constants/helper"; // Adjust path as needed

// Import for Image Picker
import * as ImagePicker from "expo-image-picker";
// Import for Document Picker
import * as DocumentPicker from "expo-document-picker";

// Dummy Message Data (initial messages)
const DUMMY_MESSAGES_INITIAL = [
  {
    id: "m1",
    sender: "other",
    type: "text",
    content:
      "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    time: "09:00",
  },
  {
    id: "m2",
    sender: "other",
    type: "text",
    content:
      "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    time: "09:30",
  },
  {
    id: "m3",
    sender: "self",
    type: "text",
    content:
      "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    time: "09:43",
  },
  {
    id: "m4",
    sender: "other",
    type: "audio",
    content: "audio_url_placeholder",
    duration: "02:50",
    time: "09:50",
  },
  {
    id: "m5",
    sender: "self",
    type: "text",
    content: "lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    time: "09:55",
  },
  {
    id: "m6",
    sender: "other",
    type: "image",
    content:
      "https://images.unsplash.com/photo-1576091160550-fd42fdb96960?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    time: "10:05",
  },
  {
    id: "m7",
    sender: "self",
    type: "text",
    content: "Got it! Thanks for the info.",
    time: "10:10",
  },
];

const ChatDetailScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const scrollViewRef = useRef();

  const chatPartnerName = params.chatPartnerName || "Chat Partner";
  const chatPartnerImage =
    params.chatPartnerImage ||
    "https://placehold.co/100x100/ADD8E6/000000?text=U";

  // Messages are now initialized directly, no loading state for initial fetch
  const [messages, setMessages] = useState(DUMMY_MESSAGES_INITIAL);
  const [newMessage, setNewMessage] = useState("");
  // Removed: loadingMessages state

  useEffect(() => {
    // Scroll to bottom when messages update
    const scrollToBottom = () => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    };
    // Give a small delay to ensure layout is calculated, especially on initial load
    const timeout = setTimeout(scrollToBottom, 50);
    return () => clearTimeout(timeout);
  }, [messages.length]); // Re-run effect when message count changes

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const newMsg = {
      id: `m${messages.length + 1}`,
      sender: "self",
      type: "text",
      content: newMessage.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prevMessages) => [...prevMessages, newMsg]);
    setNewMessage("");
    
  };

  // Handle attaching files/pictures
  const handleAttachFile = async () => {
    Alert.alert("Attach File", "Choose an option:", [
      {
        text: "Send Photo/Video",
        onPress: async () => {
          const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== "granted") {
            Alert.alert(
              "Permission Required",
              "Please grant media library permissions to send photos."
            );
            return;
          }

          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaType.Images, // Only images for now
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
          });

          if (!result.canceled && result.assets && result.assets.length > 0) {
            const newImageMsg = {
              id: `m${messages.length + 1}`,
              sender: "self",
              type: "image",
              content: result.assets[0].uri, // Use the URI of the selected image
              time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            };
            setMessages((prevMessages) => [...prevMessages, newImageMsg]);
           
          }
        },
      },
      {
        text: "Send Document",
        onPress: async () => {
          try {
            const result = await DocumentPicker.getDocumentAsync({
              type: "*/*",
              copyToCacheDirectory: false, 
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
              const file = result.assets[0];
              const newFileMsg = {
                id: `m${messages.length + 1}`,
                sender: "self",
                type: "file",
                content: file.name, // Display file name
                uri: file.uri, // Store URI for potential opening/download
                size: file.size, // File size
                time: new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              };
              setMessages((prevMessages) => [...prevMessages, newFileMsg]);
             
            }
          } catch (err) {
            console.error("Document picking failed:", err);
            Alert.alert("Error", "Failed to pick document.");
          }
        },
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const handleViewDoctorProfile = () => {
    
    
  };

  const renderMessage = (message) => {
    const isSelf = message.sender === "self";
    const bubbleStyle = isSelf
      ? styles.selfMessageBubble
      : styles.otherMessageBubble;
    const textStyle = isSelf ? styles.selfMessageText : styles.otherMessageText;
    const timeStyle = isSelf ? styles.selfMessageTime : styles.otherMessageTime;

    return (
      <View
        key={message.id}
        style={[
          styles.messageContainer,
          isSelf ? styles.selfMessageContainer : styles.otherMessageContainer,
        ]}
      >
        {message.type === "text" ? (
          <View style={bubbleStyle}>
            <Text style={textStyle}>{message.content}</Text>
          </View>
        ) : message.type === "audio" ? (
          <View style={[bubbleStyle, styles.audioMessageBubble]}>
            <MaterialCommunityIcons
              name="play-circle"
              size={30}
              color={isSelf ? COLORS.white : COLORS.primary}
              style={styles.audioPlayIcon}
            />
            <View style={styles.audioSlider}>
              <View style={[styles.audioProgress, { width: "50%" }]} />
            </View>
            <Text
              style={
                isSelf
                  ? styles.selfMessageAudioDuration
                  : styles.otherMessageAudioDuration
              }
            >
              {message.duration}
            </Text>
          </View>
        ) : message.type === "image" ? (
          <View style={[bubbleStyle, styles.imageMessageBubble]}>
            <Image
              source={{ uri: message.content }}
              style={styles.messageImage}
            />
          </View>
        ) : message.type === "file" ? (
          <TouchableOpacity
            onPress={() =>
              Alert.alert("Open File", `Opening: ${message.content}`)
            }
            style={[bubbleStyle, styles.fileMessageBubble]}
          >
            <Ionicons
              name="document-text-outline"
              size={24}
              color={isSelf ? COLORS.white : COLORS.primary}
            />
            <Text style={[textStyle, styles.fileNameText]} numberOfLines={1}>
              {message.content}
            </Text>
            {/* Optional: Add file size */}
            {message.size && (
              <Text
                style={
                  isSelf
                    ? styles.selfMessageAudioDuration
                    : styles.otherMessageAudioDuration
                }
              >
                {(message.size / 1024).toFixed(1)} KB
              </Text>
            )}
          </TouchableOpacity>
        ) : null}
        <Text style={timeStyle}>{message.time}</Text>
      </View>
    );
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
            onPress={() => router.back()}
            style={styles.headerButton}
          >
            <Ionicons name="chevron-back" size={28} color={COLORS.white} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleViewDoctorProfile}
            style={styles.headerTitleContainer}
          >
            <Text style={styles.headerTitle}>{chatPartnerName}</Text>
          </TouchableOpacity>
          <View style={styles.headerRightIcons}>
            <TouchableOpacity style={styles.headerIcon}>
              <Ionicons name="call-outline" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon}>
              <Ionicons
                name="videocam-outline"
                size={24}
                color={COLORS.white}
              />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? insets.top + 60 : 0}
      >
        {/* No loading spinner here, messages are initialized directly */}
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            scrollViewRef.current.scrollToEnd({ animated: true })
          }
        >
          {messages.map(renderMessage)}
        </ScrollView>
        {/* Message Input Area */}
        <View style={[styles.inputArea, { paddingBottom: insets.bottom }]}>
          <TouchableOpacity
            style={styles.inputActionButton}
            onPress={handleAttachFile}
          >
            <MaterialCommunityIcons
              name="paperclip"
              size={24}
              color={COLORS.iconSecondary}
            />
          </TouchableOpacity>
          <TextInput
            style={styles.messageInput}
            placeholder="Write Here..."
            placeholderTextColor={COLORS.textPlaceholder}
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
          />
          <TouchableOpacity style={styles.inputActionButton}>
            <MaterialCommunityIcons
              name="microphone"
              size={24}
              color={COLORS.iconSecondary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendMessage}
          >
            <Ionicons name="play" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerGradient: {
    paddingBottom: 15, // Adjusted for header content
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
  headerTitleContainer: {
    flex: 1, // Allows title to be clickable and take space
    alignItems: "center", // Center the text within its touchable area
    justifyContent: "center",
    marginLeft: -28, // Offset for back button's width to visually center title
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.white,
  },
  headerRightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    padding: 5,
    marginLeft: 10,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  // Removed loadingContainer and loadingText styles completely
  messagesContainer: {
    flexGrow: 1, // Allows content to grow and be scrollable
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: "flex-end", // Stick messages to bottom
  },
  messageContainer: {
    maxWidth: "80%", // Limit bubble width
    marginBottom: 10,
  },
  selfMessageContainer: {
    alignSelf: "flex-end", // Align self messages to the right
  },
  otherMessageContainer: {
    alignSelf: "flex-start", // Align other messages to the left
  },
  selfMessageBubble: {
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    borderBottomRightRadius: 5, // Pointed corner for self
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  otherMessageBubble: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    borderBottomLeftRadius: 5, // Pointed corner for other
    paddingVertical: 10,
    paddingHorizontal: 15,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  selfMessageText: {
    fontSize: 15,
    color: COLORS.white,
  },
  otherMessageText: {
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  selfMessageTime: {
    fontSize: 11,
    color: COLORS.textLight, // Lighter time on dark bubble
    textAlign: "right",
    marginTop: 5,
    marginRight: 5,
  },
  otherMessageTime: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: "left",
    marginTop: 5,
    marginLeft: 5,
  },
  audioMessageBubble: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  audioPlayIcon: {
    marginRight: 10,
  },
  audioSlider: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.separator,
    borderRadius: 2,
    marginRight: 10,
  },
  audioProgress: {
    height: "100%",
    backgroundColor: COLORS.secondary, // Progress color
    borderRadius: 2,
  },
  selfMessageAudioDuration: {
    fontSize: 12,
    color: COLORS.white,
  },
  otherMessageAudioDuration: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  imageMessageBubble: {
    padding: 5, // Smaller padding for image bubbles
  },
  messageImage: {
    width: 200, // Fixed width for dummy image, adjust as needed
    height: 150, // Fixed height for dummy image, adjust as needed
    borderRadius: 10,
    resizeMode: "cover",
  },
  fileMessageBubble: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  fileNameText: {
    marginLeft: 10,
    flexShrink: 1, // Allow text to wrap or truncate
  },
  inputArea: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
  },
  inputActionButton: {
    padding: 8,
  },
  messageInput: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: COLORS.textPrimary,
    maxHeight: 100, // Limit height for multiline input
    marginHorizontal: 10,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
});

export default ChatDetailScreen;
