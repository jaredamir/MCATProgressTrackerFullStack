"use client"
import BarChart from '../components/BarChart';
import { useState, useEffect } from "react";
import ReasonForMissingFrequencyChart from '../components/ReasonForMissingFrequencyChart'
import axios from 'axios';
import ChartComponent from '@/components/ChartComponent';

const testData = {
  "Frequency For Missing" : {
    "graphType": "Bar",
    "data": {'2025-02-01': {'Data table misinterpretation': 6, 'Low on time': 7, 'lacking topic understanding': 15, 'Content issue (Memorization)': 7, 'Math Error': 3, 'Educated Guessed': 1, 'Missed important text info': 4, 'Misread question': 1, 'logic error': 2, 'Misread Prompt/Text': 1}, '2025-02-08': {'Missed important text info': 12, 'Content issue (Memorization)': 18, 'Overgeneralization of info ': 5, 'Misread question': 4, 'lacking topic understanding': 28, 'Thought too simply': 3, 'Data table misinterpretation': 7, 'Educated Guessed': 2, 'Forgot Info From passage': 4, 'logic error': 8, 'Misread Answer Choice/Choices': 4, 'Misunderstood Passage info': 8, "Wasn't the best answer for the question": 5, 'Completely clueless': 1, 'Did not understand question': 1, 'Math Error': 2}}
  },
  "Scores" : {
    "graphType": "Line",
    "data": {'2025-02-01': {'Data table misinterpretation': 6, 'Low on time': 7, 'lacking topic understanding': 15, 'Content issue (Memorization)': 7, 'Math Error': 3, 'Educated Guessed': 1, 'Missed important text info': 4, 'Misread question': 1, 'logic error': 2, 'Misread Prompt/Text': 1}, '2025-02-08': {'Missed important text info': 12, 'Content issue (Memorization)': 18, 'Overgeneralization of info ': 5, 'Misread question': 4, 'lacking topic understanding': 28, 'Thought too simply': 3, 'Data table misinterpretation': 7, 'Educated Guessed': 2, 'Forgot Info From passage': 4, 'logic error': 8, 'Misread Answer Choice/Choices': 4, 'Misunderstood Passage info': 8, "Wasn't the best answer for the question": 5, 'Completely clueless': 1, 'Did not understand question': 1, 'Math Error': 2}}
  }
}
const graphTypes = ["bar", "line"]
export default function Home() {
  const [chartData, setChartData] = useState<any>(null);
  const [chartView, setChartView] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [analyticGraphs, setAnalyticGraphs] = useState<{any: any} | {}>({})
  /*  
  analyticGraphs = {
    analytic1: {test1: <BarGraph data={test1.data} />, test2: <BarGraph data={test1} />]},
    analytic2: {test1: <BarGraph data={test1.data} />, test2: <BarGraph data={test1} />]},
  }
  */

  function updateAnalyticGraphs(analytics: any){
    let analyticMap = {};
    console.log("analytics", analytics)
    console.log("analyticskeys", Object.keys(analytics))
    for (const analytic of Object.keys(analytics)) {
      console.log("analytic", analytic)
      console.log("analytic data", analytics[analytic])
      let graphsMap = {}
      const graphType = analytics[analytic].graphType
      for (const test of Object.keys(analytics[analytic].data)) {
        graphsMap[test] = createGraphFromData(analytics[analytic].data[test], graphType, test, analytic)
        console.log("graphsMap", graphsMap)
      }

      analyticMap[analytic] = graphsMap

    }
    console.log("analyticMap", analyticMap)
    setAnalyticGraphs(analyticMap)
  }

  function createGraphFromData(analyticalData: any, graphType: any, name: string, analytic: string) {
    //take the data and return a graph for it
    console.log("create", analyticalData, graphType)
    if (!graphTypes.includes(graphType.toLowerCase())) return undefined
    return <ChartComponent analytic={analytic} chartName={name} data={analyticalData} graphType={graphType} />
  }

  useEffect(()=>{
    updateAnalyticGraphs(testData)
  }, [])

  const AnalyticGraphDisplay = () => {
    return (
        <div>
            {Object.keys(analyticGraphs).map((analyticKey) => (
                <div key={analyticKey}>
                    <h3>{analyticKey}</h3>
                    {Object.keys(analyticGraphs[analyticKey]).map((testKey) => (
                        <div key={testKey}>
                            <h4>{testKey}</h4>
                            {analyticGraphs[analyticKey][testKey]}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};
  /*
  async function getReasonForMissingFrequencyData(){
    console.log("called")
    setIsLoading(false);
    try {
      const res = await axios.get("http://localhost:5000/api/reason-for-missing-frequencies", {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true // This ensures cookies are included in the request
      });
  
      // If successful, set the data
      setChartData(res.data);
      setChartView(<ReasonForMissingFrequencyChart data={res.data}/>);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  }
    */
  return (
    <div>
      <div>
        {Object.keys(analyticGraphs).map((analyticKey) => (
            <div key={analyticKey}>
                <h3>{analyticKey}</h3>
                {Object.keys(analyticGraphs[analyticKey]).map((testKey) => (
                    <div key={testKey}>
                        <h4>{testKey}</h4>
                        {analyticGraphs[analyticKey][testKey]}
                    </div>
                ))}
            </div>
        ))}
      </div>
      {/* {<main>
        
      <div style={{
        display: 'flex',
        gap: '15px',

      }}>
        <p>Needs review</p>
        <p onClick={() => getReasonForMissingFrequencyData()}>Reason for missing</p>
      </div>
        {isLoading ? "loading..." : undefined}
        {chartView}
      </main>} */}
    </div>
  );
}
