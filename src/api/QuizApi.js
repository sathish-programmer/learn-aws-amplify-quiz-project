import { listQuizzes } from "../graphql/queries";
import { generateClient } from 'aws-amplify/api';
import { createQuiz } from "../graphql/mutations";

// get table from dynamo db
const client = generateClient();
const QuizAPI = {
  listQuiz: async function () {
    let response = client.graphql({ query: listQuizzes });
    console.log(response);
    return response;
  },

  insertQuizData: async function (quizData) {
    const promises = quizData.map(async (quizItem) => {
      const response = await client.graphql({
        query: createQuiz,
        variables: {
          input: quizItem
        }
      });
      return response.data.createQuiz;
    });

    try {
      const results = await Promise.all(promises);
      console.log('Insert results:', results);
      return results;
    } catch (error) {
      console.error('Error inserting quiz data:', error);
      throw error;
    }
  }
};
export default QuizAPI;
