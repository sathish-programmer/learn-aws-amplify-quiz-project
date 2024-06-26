import React, { useState } from 'react';
import QuizAPI from './api/QuizApi';
import styled from 'styled-components';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 600px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
`;

const Label = styled.label`
  margin: 10px 0 5px;
  color:#000;
`;

const Input = styled.input`
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 3px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;
const InsertQuiz = ({ onQuizInserted }) => {
  const [quizItem, setQuizItem] = useState({
    question: '',
    options: ['', '', '', ''],
    answer: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuizItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index, value) => {
    setQuizItem((prev) => {
      const options = [...prev.options];
      options[index] = value;
      return { ...prev, options };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await QuizAPI.insertQuizData([quizItem]);
      alert('Quiz data inserted successfully');
      setQuizItem({ question: '', options: ['', '', '', ''], answer: '' });
      onQuizInserted(); // Call the callback to update the quiz list
    } catch (error) {
      console.error('Error inserting quiz data:', error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
    <Label>Question:</Label>
    <Input type="text" name="question" value={quizItem.question} onChange={handleChange} />

    <Label>Options:</Label>
    {quizItem.options.map((option, index) => (
      <Input
        key={index}
        type="text"
        value={option}
        onChange={(e) => handleOptionChange(index, e.target.value)}
      />
    ))}

    <Label>Answer:</Label>
    <Input type="text" name="answer" value={quizItem.answer} onChange={handleChange} />

    <Button type="submit">Insert Quiz</Button>
  </Form>
  );
};

export default InsertQuiz;
