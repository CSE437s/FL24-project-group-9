import { useState } from 'react'
import ChatBot from 'react-chatbotify'

import { useAuthContext } from '../context/useContext'
import { ChatResponse } from '../models/Chatbot'
import { Course } from '../models/Course'
import ChatAPI from '../services/ChatAPI'

enum FlowStep {
  Start = 'start',
  FindCourse = 'findCourse',
  GetCourse = 'getCourse',
  RecommendedCourse = 'recommendedCourse',
  AddCourse = 'addCourse',
  SaveSemester = 'saveSemester',
  NoCourse = 'noCourse',
  End = 'end',
}

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
      return FlowStep.RecommendedCourse
    } catch (error) {
      console.error('Error fetching course recommendation:', error)
      return FlowStep.NoCourse
    }
  }

  const addCourseToSemester = async (course: Course, semester: string) => {
    // TODO: Add course to semester
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
    header: {
      title: <h5>PlannerBot</h5>,
    },
  }

  const flow = {
    [FlowStep.Start]: {
      transition: 0,
      message:
        'Hello! Welcome to CoursePlanner. I can help you find courses that best fit your interests.',
      path: FlowStep.FindCourse,
    },
    [FlowStep.FindCourse]: {
      message: 'Please describe a course you are looking for.',
      path: FlowStep.GetCourse,
    },
    [FlowStep.GetCourse]: {
      transition: 0,
      path: async (params: { userInput: string }) => {
        const result = await fetchData(params.userInput)
        return result
      },
    },
    [FlowStep.RecommendedCourse]: {
      transition: 0,
      message: `${chatResponse?.message ?? 'Description unavailable'}`,
      path: FlowStep.AddCourse,
    },
    [FlowStep.AddCourse]: {
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
          return FlowStep.NoCourse
        }
        return FlowStep.SaveSemester
      },
      function: (params: { userInput: string }) =>
        setChosenSemester(params.userInput),
    },
    [FlowStep.SaveSemester]: {
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
      path: FlowStep.End,
    },
    [FlowStep.NoCourse]: {
      message:
        "I'm sorry, I couldn't find any courses for you. Please try again.",
      path: FlowStep.GetCourse,
    },
    [FlowStep.End]: {
      message:
        'Thank you for using the CoursePlanner chatbot. Do you want to find more courses?',
      options: ['Yes'],
      path: async (params: { userInput: string }) => {
        if (params.userInput === 'Yes') {
          return FlowStep.FindCourse
        }
        return FlowStep.End
      },
      chatDisabled: true,
    },
  }

  return <ChatBot settings={settings} flow={flow} />
}
