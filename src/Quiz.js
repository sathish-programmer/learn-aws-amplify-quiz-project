import React, { useState, useEffect } from 'react';
import QuizAPI from './api/QuizApi';
import InsertQuiz from './InsertQuiz';

function Quiz() {
  const [quizData, setQuizData] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);

  useEffect(() => {
    fetchQuizData();
  }, []);

  // fetch questions from dynamo db
  const fetchQuizData = async () => {
    try {
      const quizData = await QuizAPI.listQuiz();
      const quizDetails = quizData.data.listQuizzes.items;
      console.log(quizDetails, 'quizDetails');
      setQuizData(quizDetails);
    } catch (error) {
      console.error('Error fetching quiz data:', error);
    }
  };

  const handleAnswerOptionClick = (option) => {
    const correctAnswer = quizData[currentQuestion].answer;
    setSelectedAnswer(option);
    if (option === correctAnswer) {
      setScore(score + 1);
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }

    setTimeout(() => {
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < quizData.length) {
        setCurrentQuestion(nextQuestion);
        setIsCorrect(null);
        setSelectedAnswer("");
      } else {
        setShowScore(true);
      }
    }, 1000);
  };

  return (
    <div className='quiz'>
      <InsertQuiz onQuizInserted={fetchQuizData} />
      {showScore ? (
        <div className='score-section'>
          You scored {score} out of {quizData.length}
        </div>
      ) : (
        quizData.length > 0 && (
          <>
            <div className='question-section'>
              <div className='question-count'>
                <span>Question {currentQuestion + 1}</span>/{quizData.length}
              </div>
              <div className='question-text'>{quizData[currentQuestion].question}</div>
            </div>
            <div className='answer-section'>
              {quizData[currentQuestion].options.map((option) => (
                <button 
                  onClick={() => handleAnswerOptionClick(option)} 
                  key={option}
                  style={{ backgroundColor: selectedAnswer === option ? (isCorrect ? 'lightgreen' : 'pink') : '' }}
                >
                  {option}
                </button>
              ))}
            </div>
            {selectedAnswer && (
              <div style={{ marginTop: '10px' }}>
                {isCorrect ? 'Correct! 🎉' : 'Sorry, that’s not right. 😢'}
              </div>
            )}
          </>
        )
      )}
    </div>
  );
}

export default Quiz;
