import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { nanoid } from 'nanoid';

const CommentSection = () => {
  const [comments, setComments] = useState([
    { id: nanoid(), user: 'Lalit', text: 'Wow, that panel was epic!' },
    { id: nanoid(), user: 'Alex', text: 'The art is 🔥' },
  ]);

  const [inputText, setInputText] = useState('');

  const handleAddComment = () => {
    if (inputText.trim() === '') return;

    const newComment = {
      id: nanoid(),
      user: 'You',
      text: inputText.trim(),
    };

    setComments([newComment, ...comments]);
    setInputText('');
  };

  const renderComment = ({ item }) => (
    <View style={styles.comment}>
      <Text style={styles.username}>{item.user}</Text>
      <Text style={styles.commentText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Comments</Text>

      <FlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        inverted
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a comment..."
          placeholderTextColor="#666"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity onPress={handleAddComment} style={styles.button}>
          <Text style={styles.buttonText}>Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CommentSection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#000',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#fff',
  },
  list: {
    paddingBottom: 10,
  },
  comment: {
    marginBottom: 10,
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  username: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#3b82f6', // Blue color for usernames
  },
  commentText: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#333',
    paddingTop: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#333',
  },
  button: {
    backgroundColor: '#3b82f6',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
}); 
