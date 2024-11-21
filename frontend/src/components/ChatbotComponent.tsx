import { useState } from 'react'
import ChatBot from 'react-chatbotify'

import {
  useAcademicDataContext,
  useAuthContext,
  useStudentContext,
} from '../context/useContext'
import { ChatResponse } from '../models/Chatbot'
import { Course } from '../models/Course'
import ChatAPI from '../services/ChatAPI'

enum FlowStep {
  Start = 'start', // initial start flow
  FindCourse = 'findCourse', // when user enter course description
  GetCourse = 'getCourse', // fetching course recommendation from API
  RecommendedCourse = 'recommendedCourse', // display course recommendation
  SelectCourse = 'selectCourse', // user decides to select course or not
  AddCourse = 'addCourse', // choosing a semester to add course
  SaveSemester = 'saveSemester', // saving course to semester and update API
  NoCourse = 'noCourse', // no courses found
  End = 'end',
}

export const ChatbotComponent = () => {
  const { loading, bearerToken } = useAuthContext()
  const { academicLoading } = useAcademicDataContext()
  const { studentLoading, semesters, updateSemester } = useStudentContext()

  const [chatResponse, setChatReponse] = useState<ChatResponse>()
  const [chosenSemester, setChosenSemester] = useState<string>()
  const [recommendedCourse, setRecommendedCourse] = useState<Course>()

  if (loading || academicLoading || studentLoading) {
    return <></>
  }

  async function fetchData(userInput: string) {
    try {
      const response = await ChatAPI.getRecommendedCourse(
        bearerToken,
        userInput
      )
      setChatReponse(response)

      if (response.course) {
        setRecommendedCourse(response.course)
        return FlowStep.RecommendedCourse
      }
      return FlowStep.NoCourse
    } catch (error) {
      console.error('Error fetching course recommendation:', error)
      return FlowStep.NoCourse
    }
  }

  function getSemestersOptions() {
    return semesters
      .filter((s) => !s.isCompleted)
      .map((s) => s.name)
      .concat('No')
  }

  const addCourseToSemester = async (
    newCourse: Course,
    semesterName: string
  ) => {
    const semester = semesters.find(
      (semester) => semester.name === semesterName
    )

    if (!semester) {
      return
    }

    if (
      !newCourse ||
      semester.planned_courses.find((c) => c === newCourse.id)
    ) {
      return
    }

    semester.planned_courses.push(newCourse.id)

    updateSemester(semester)
  }

  const settings = {
    isOpen: true,
    general: {
      primaryColor: '#a51417',
      secondaryColor: '#a51416d0',
    },
    chatHistory: {
      disabled: true,
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
      message: () => {
        const message = chatResponse?.message ?? 'Description unavailable'

        setChatReponse(undefined)
        return message
      },
      path: FlowStep.SelectCourse,
    },
    [FlowStep.SelectCourse]: {
      message: 'Would you like to add this course to your schedule?',
      options: ['Yes', 'No'],
      chatDisabled: true,
      path: (params: { userInput: string }) => {
        return params.userInput === 'No'
          ? FlowStep.NoCourse
          : FlowStep.AddCourse
      },
    },
    [FlowStep.AddCourse]: {
      message: 'Please choose a semester to add the course to.',
      options: getSemestersOptions(),
      chatDisabled: true,
      path: (params: { userInput: string }) => {
        return params.userInput === 'No'
          ? FlowStep.NoCourse
          : FlowStep.SaveSemester
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
      message: () => {
        const message =
          chatResponse?.message ??
          "I'm sorry, I couldn't find any courses for you. Please try again."

        setChatReponse(undefined)
        return message
      },
      path: FlowStep.GetCourse,
    },
    [FlowStep.End]: {
      message:
        'Thank you for using the CoursePlanner chatbot. Do you want to find more courses?',
      options: ['Yes'],
      path: async (params: { userInput: string }) => {
        return params.userInput === 'Yes' ? FlowStep.FindCourse : FlowStep.End
      },
      chatDisabled: true,
    },
  }

  return <ChatBot settings={settings} flow={flow} />
}
