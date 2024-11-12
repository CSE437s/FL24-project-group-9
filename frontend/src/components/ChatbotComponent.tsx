import { useState } from 'react'
import ChatBot from 'react-chatbotify'

import { useAuthContext } from '../context/useContext'
import { ChatResponse } from '../models/Chatbot'
import { Course } from '../models/Course'
import ChatAPI from '../services/ChatAPI'

export const ChatbotComponent = () => {
  const { bearerToken } = useAuthContext()

  const [chatResponse, setChatReponse] = useState<ChatResponse>()
  const [chosenSemester, setChosenSemester] = useState<string>()
  const [recommendedCourse, setRecommendedCourse] = useState<Course>()

  async function fetchData(userInput: string) {
    try {
      const response = await ChatAPI.getRecommendedCourse(
        bearerToken,
        userInput
      )
      setChatReponse(response)
      setRecommendedCourse(response.course)
      return 'recommendedCourse'
    } catch (error) {
      console.log(error)
      return 'noCourse'
    }
  }

  const addCourseToSemester = async (course: Course, semester: string) => {
    // Add course to semester
  }

  const settings = {
    isOpen: true,
    general: {
      primaryColor: '#a51417',
      secondaryColor: '#a51416d0',
    },
    chatHistory: {
      storageKey: 'planner-chat-history',
    },
  }

  const flow = {
    start: {
      transition: 0,
      message:
        'Hello! Welcome to CoursePlanner. I can help you find courses that best fit your interests.',
      path: 'findCourse',
    },
    findCourse: {
      message: 'Please describe a course you are looking for.',
      path: 'getCourse',
    },
    getCourse: {
      transition: 0,
      path: async (params: { userInput: string }) => {
        const result = await fetchData(params.userInput)
        return result
      },
    },
    recommendedCourse: {
      transition: 0,
      message: `${chatResponse?.message ?? 'Description unavailable'}`,
      path: 'addCourse',
    },
    addCourse: {
      message: 'Would you like to add this course to your schedule?',
      options: [
        'Add to Spring 2024',
        'Add to Fall 2024',
        'Add to Spring 2025',
        'No',
      ],
      chatDisabled: true,
      path: (params: { userInput: string }) => {
        if (params.userInput === 'No') {
          return 'noCourse'
        }
        return 'saveSemester'
      },
      function: (params: { userInput: string }) =>
        setChosenSemester(params.userInput),
    },
    saveSemester: {
      transition: async () => {
        if (recommendedCourse && chosenSemester) {
          addCourseToSemester(recommendedCourse, chosenSemester)
            .then(() => {
              setRecommendedCourse(undefined)
              setChosenSemester(undefined)
            })
            .catch((err) => console.log(err))
            .finally(() => {
              return 0
            })
        }
        return 0
      },
      message: async (params: { userInput: string }) =>
        `Course added to ${params.userInput}!`,
      path: 'end',
    },
    noCourse: {
      message:
        "I'm sorry, I couldn't find any courses for you. Please try again.",
      path: 'getCourse',
    },
    end: {
      message:
        'Thank you for using the CoursePlanner chatbot. Do you want to find more courses?',
      options: ['Yes'],
      path: async (params: { userInput: string }) => {
        if (params.userInput === 'Yes') {
          return 'findCourse'
        }
      },
      chatDisabled: true,
    },
  }

  return <ChatBot settings={settings} flow={flow} />
}
