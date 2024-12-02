import { useState } from 'react'
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Legend,
	Tooltip,
	ResponsiveContainer 
	} from 'recharts';

import { useAcademicDataContext } from '../context/useContext'
import { Semester } from '../models/Semester'
import { utils } from '../utils'

const BarCharComponent = () => {
	return (
		<ResponsiveContainer width = "100%" height = "100%
			<BarChart
			width={500}
			height={300}
			>
			<YAxis dataKey="Credits" />
			<XAxis dataKey="Semester" />
			<CartesianGrid strokeDashArray="5 5"/>
			<Tooltip/>
			<Legend/>
			
			</BarChart>
		</ResponsiveContainer>
		
		