"use client"
import BarChart from '../components/BarChart';
import { useState, useEffect } from "react";
import ReasonForMissingFrequencyChart from '../components/ReasonForMissingFrequencyChart'
import axios from 'axios';
import ChartComponent from '@/components/ChartComponent';

const testData = {
  "Frequency For Missing" : {
    "graphType": "Bar",
    "data": {'2025-02-01': {'Data table misinterpretation': 6, 'Low on time': 7, 'lacking topic understanding': 15, 'Content issue (Memorization)': 7, 'Math Error': 3, 'Educated Guessed': 1, 'Missed important text info': 4, 'Misread question': 1, 'logic error': 2, 'Misread Prompt/Text': 1, "Didn't answer": 7}, '2025-02-08': {"Needed to use the bathroom": 4, 'Missed important text info': 12, 'Content issue (Memorization)': 18, 'Overgeneralization of info ': 5, 'Misread question': 4, 'lacking topic understanding': 28, 'Thought too simply': 3, 'Data table misinterpretation': 7, 'Educated Guessed': 2, 'Forgot Info From passage': 4, 'logic error': 8, 'Misread Answer Choice/Choices': 4, 'Misunderstood Passage info': 8, "Wasn't the best answer for the question": 5, 'Completely clueless': 1, 'Did not understand question': 1, 'Math Error': 2}}
  },
  "Scores" : {
    "graphType": "Bar",
    "data": {"2025-02-01":{"chem_phys_score":123.0,"cars_score":122.0,"bio_bio_chem_score":122.0,"psych_soc_score":125.0},"2025-02-08":{"chem_phys_score":125.0,"cars_score":125.0,"bio_bio_chem_score":124.0,"psych_soc_score":126.0},"2025-02-16":{"chem_phys_score":120.0,"cars_score":124.0,"bio_bio_chem_score":123.0,"psych_soc_score":123.0}}
  },
  "Reason for Missing": {
    "graphType": "Bar",
    "data": {"2025-02-01":{"Data table misinterpretation":4,"Content issue (Memorization)":6,"lacking topic understanding":9,"Educated Guessed":1,"logic error":2,"Missed important text info":2,"Math Error":2,"Misread Prompt/Text":1,"Misread question":1,"Low on time":1},"2025-02-08":{"Data table misinterpretation":3,"Content issue (Memorization)":4,"lacking topic understanding":7,"logic error":1,"Missed important text info":2,"Misread Prompt/Text":1,"Math Error":1},"2025-02-16":{"Data table misinterpretation":2,"Content issue (Memorization)":5,"lacking topic understanding":8,"Educated Guessed":1,"logic error":1,"Missed important text info":1,"Math Error":1,"Misread question":1}}
  },
  "Topics Missed" : {
    graphType: "Bar",
    data: {"2025-02-01":{"kreb cycle":5,"amino acids":12,"gestalt principles":2,"photosynthesis":3,"human anatomy":7,"nervous system":8,"enzymes":4},"2025-02-08":{"kreb cycle":4,"amino acids":10,"gestalt principles":1,"neurotransmitters":6,"cell division":3,"immune system":5,"molecular biology":2},"2025-02-16":{"kreb cycle":6,"amino acids":8,"gestalt principles":2,"photosynthesis":5,"human anatomy":9,"nervous system":4,"enzymes":7}}
  }
}
const graphTypes = ["bar", "line"]

function normalizeData(data) {
  const allKeys = new Set();

  // Collect all possible keys from all dates
  Object.values(data).forEach(dateEntry => {
    Object.keys(dateEntry).forEach(key => allKeys.add(key));
  });

  // Convert the set to an array and sort the keys alphabetically
  const sortedKeys = [...allKeys].sort();

  // Fill missing keys with 0 for each date and ensure keys are in sorted order
  Object.keys(data).forEach(date => {
    const dateEntry = data[date];
    sortedKeys.forEach(key => {
      if (!(key in dateEntry)) {
        dateEntry[key] = 0;
      }
    });

    // Sort the date entry object to ensure keys are in the same order (if needed)
    data[date] = sortedKeys.reduce((acc, key) => {
      acc[key] = dateEntry[key];
      return acc;
    }, {});
  });

  return data;
}
  /*{ steralized data example
    "Frequency For Missing": {
        "graphType": "Bar",
        "data": {
            "2025-02-01": {
                "Data table misinterpretation": 6,
                "Low on time": 7,
                "lacking topic understanding": 15,
                "Content issue (Memorization)": 7,
                "Math Error": 3,
                "Educated Guessed": 1,
                "Missed important text info": 4,
                "Misread question": 1,
                "logic error": 2,
                "Misread Prompt/Text": 1,
                "Didn't answer": 7,
                "Needed to use the bathroom": 0,
                "Overgeneralization of info ": 0,
                "Thought too simply": 0,
                "Forgot Info From passage": 0,
                "Misread Answer Choice/Choices": 0,
                "Misunderstood Passage info": 0,
                "Wasn't the best answer for the question": 0,
                "Completely clueless": 0,
                "Did not understand question": 0
            },
            "2025-02-08": {
                "Needed to use the bathroom": 4,
                "Missed important text info": 12,
                "Content issue (Memorization)": 18,
                "Overgeneralization of info ": 5,
                "Misread question": 4,
                "lacking topic understanding": 28,
                "Thought too simply": 3,
                "Data table misinterpretation": 7,
                "Educated Guessed": 2,
                "Forgot Info From passage": 4,
                "logic error": 8,
                "Misread Answer Choice/Choices": 4,
                "Misunderstood Passage info": 8,
                "Wasn't the best answer for the question": 5,
                "Completely clueless": 1,
                "Did not understand question": 1,
                "Math Error": 2,
                "Low on time": 0,
                "Misread Prompt/Text": 0,
                "Didn't answer": 0
            }
        }
    },
    "Scores": {
        "graphType": "Line",
        "data": {
            "2025-02-01": {
                "Data table misinterpretation": 6,
                "Low on time": 7,
                "lacking topic understanding": 15,
                "Content issue (Memorization)": 7,
                "Math Error": 3,
                "Educated Guessed": 1,
                "Missed important text info": 4,
                "Misread question": 1,
                "logic error": 2,
                "Misread Prompt/Text": 1,
                "Overgeneralization of info ": 0,
                "Thought too simply": 0,
                "Forgot Info From passage": 0,
                "Misread Answer Choice/Choices": 0,
                "Misunderstood Passage info": 0,
                "Wasn't the best answer for the question": 0,
                "Completely clueless": 0,
                "Did not understand question": 0
            },
            "2025-02-08": {
                "Missed important text info": 12,
                "Content issue (Memorization)": 18,
                "Overgeneralization of info ": 5,
                "Misread question": 4,
                "lacking topic understanding": 28,
                "Thought too simply": 3,
                "Data table misinterpretation": 7,
                "Educated Guessed": 2,
                "Forgot Info From passage": 4,
                "logic error": 8,
                "Misread Answer Choice/Choices": 4,
                "Misunderstood Passage info": 8,
                "Wasn't the best answer for the question": 5,
                "Completely clueless": 1,
                "Did not understand question": 1,
                "Math Error": 2,
                "Low on time": 0,
                "Misread Prompt/Text": 0
            }
        }
    }
*/


export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(true)
  const [analyticGraphs, setAnalyticGraphs] = useState({})
  /*  
  analyticGraphs = {
    analytic1: {test1: <BarGraph data={test1.data} />, test2: <BarGraph data={test1} />]},
    analytic2: {test1: <BarGraph data={test1.data} />, test2: <BarGraph data={test1} />]},
  }
  */

  function updateAnalyticGraphs(analytics) {
    let analyticMap = {};
    for (const analytic of Object.keys(analytics)) {
        const { graphType, data } = analytics[analytic]; // Extract graphType and data separately
        analyticMap[analytic] = {
            graphType, 
            data: normalizeData(data) // Normalize only the data
        };
    }
    return analyticMap;
}

  
  async function getAllAnalytics(){
    console.log("called")
    setIsLoading(true);
    setIsError(false)
    try {
      const res = await axios.get("http://localhost:5000/api/get_all_analytics", {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true // This ensures cookies are included in the request
      });
  
      // If successful, set the data
      setAnalyticGraphs(updateAnalyticGraphs(res.data));
    } catch (err) {
      console.error("Error fetching data:", err);
      setIsError(true)
    } finally {
      setIsLoading(false);
    }
  }
  
  useEffect(()=>{
    //setAnalyticGraphs(updateAnalyticGraphs(testData));
     getAllAnalytics()
  }, [])


  return (
    <div>
      {isLoading && <p>...Loading</p>}
      {isError && <p>Something went wrong</p>}
      <div>
            {Object.keys(analyticGraphs).map((analytic) => (
                <div key={analytic}>
                    <h3>{analytic}</h3>
                    <ChartComponent data={analyticGraphs[analytic]} />
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
