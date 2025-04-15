"use client"
import BarChart from '../components/BarChart';
import { useState, useEffect } from "react";
import ReasonForMissingFrequencyChart from '../components/ReasonForMissingFrequencyChart'
import axios from 'axios';
import ChartComponent from '@/components/ChartComponent';

const datafromBackend = {'Frequency of Topics Relating To Missed Questions': {'graphType': 'Bar', 'data': {'2025-02-01': {'Enthalpy and Entropy (Gen Chem)': 1, 'pH & pOH (Gen Chem)': 2, 'free body diagrams and vector summation (Physics)': 2, 'friction (Physics)': 1, 'Aldehydes and Ketones (Orgo)': 3, 'intermolecular forces (strongest to weakest) (Gen Chem)': 1, 'Chirality, meso compounds and identifying chiral carbons (Orgo)': 2, 'Redox reactions (Gen Chem)': 2, 'Molarity & Molality (Gen Chem)': 2, 'VESPR and the important bond angles (Gen Chem)': 1, 'Pressure (Physics)': 1, 'Equilibrium (Gen Chem)': 1, 'Potential and Kinetic energy equations (Physics)': 2, 'Hormones (Bio)': 1, 'Major Enzyme types (isomerase, transferase, etc) (Bio)': 1, 'Krebs Cycle and Oxidation Phosphorylation (Bio)': 1, 'Amino Acids  (Bio)': 2, 'Torque and the right hand rule  (Physics)': 1, 'Important Trig function numbers (sin(90), ratios of sides)  (Physics)': 1, 'Benzene and Substituents  (Orgo)': 2, 'Important Protic/Aprotic & Polar/Nonpolar Solvents (Orgo)': 1, 'Circuts (Physics)': 1, 'kinematics and the kinematic equations (Physics)': 1, 'Nuclear Decay (Gen Chem)': 1, 'nomenclature (Gen Chem)': 1, 'Glycolosis (Bio)': 1, "Fluids, bernoulli's equation and ideal fluids (Physics)": 1}, '2025-02-16': {'Enzymes and Modes of Enzyme Inhibition methods (Bio)': 1, 'Electrolytic and Galvanic (Voltaic) cell (Gen Chem)': 2, 'Optics, Lenes, Refraction, Reflection (Physics)': 2, 'Buoyant forces (Physics)': 2, 'Axon, Nodes of Ranvier, and Action Potential (Bio)': 1, 'IR spectroscopy Major, how it works and functional group ranges (Orgo)': 1, 'Oligosaccharides (Bio)': 1, 'Bond types and whats used to cleave them (disulfide bonds, glycosidic,  peptide bond) (Orgo)': 1, 'Capacitors and Capacitance (Physics)': 1, "Le Chatier's Principle (Gen Chem)": 1, 'Glucose Reactions (elongation, oxidation, reduction, etc) (Orgo)': 1, 'Stereoisomers and shape comparisons (epimers, anomers, enantiomers,  Diastereomers) (Orgo)': 1, 'Free Gibbs and Free Gibbs relation to Equilibrium (Gen Chem)': 1, 'Protein Folding Structures (Bio)': 1, 'Sphingolipids (Bio)': 1, 'Acetals and Hemiacetals (Orgo)': 1, 'Substitution vs Elimination Reactions (Orgo)': 1}, '2025-02-08': {'vmax and KM (Bio)': 1, 'Electrolytic and Galvanic (Voltaic) cell (Gen Chem)': 1, 'Cell wall transporters and Passive vs Active transport methods (Bio)': 1, 'Oxidation Numbers and Rules (Gen Chem)': 1, 'Krebs Cycle and Oxidation Phosphorylation (Bio)': 1, 'lymphatic system (Bio)': 1, 'Embryology, Differentiation, and Gastulation (Bio)': 4, 'Protein Transport through Nuclear envelope, ER, and Golgi Apparatus (Bio)': 1, 'Receptor Tyrosine Kinase Pathway (Bio)': 1, 'Amino Acids  (Bio)': 7, 'Redox reactions (Gen Chem)': 1, 'Decible and decible equation, sound intensity (Physics)': 1, 'Histones and DNA methylation (Bio)': 2, 'Light Luminescence (Physics)': 1, 'pH & pOH (Gen Chem)': 4, "Fluids, bernoulli's equation and ideal fluids (Physics)": 1, 'order of reaction rates (Gen Chem)': 2, 'Fatty Acids and Triglycerides  (Orgo)': 2, "Ohm's law, current, voltage, and resistance (Physics)": 1, 'GCPR and the G-protein-coupled-receptor pathway (Bio)': 1, 'intermolecular forces (strongest to weakest) (Gen Chem)': 1, 'Translation (Bio)': 1, 'kinematics and the kinematic equations (Physics)': 1, 'Meiosis, Alleles, and Recombination (Bio)': 4, 'DNA and Protein Separation Techniques (Bio)': 2, 'Pressure (Physics)': 1, 'Enzymes and Modes of Enzyme Inhibition methods (Bio)': 2, 'Heart and lung Anatomy and blood flow pathway (Bio)': 1, 'Nitrogen, Amide, Amines, Imines, Enimines (Orgo)': 2, 'Fat breakdown in glucose deficiency  (Bio)': 1, 'Carboxylic Acid derivatives (Orgo)': 1, 'Michaelis Menten Equation (Bio)': 1, 'erythrocytes and hemoglobin  (Bio)': 2, 'Power (mechanical, electrical, thermal) (Physics)': 1, 'PCR (Bio)': 1, 'Partial Pressure (Gen Chem)': 1, 'Oligodendrocytes and the central nervous system (Bio)': 1, 'Protein Folding Structures (Bio)': 1, 'Aerobic vs anaerobic metabolism  (Bio)': 1, 'Blood Types (Bio)': 1, 'Kidney and Nephron Anatomy (Bio)': 1, 'Bone structure and cell production  (Bio)': 1, 'Positive/Negative Inducible/Repressive Operons (Bio)': 1, 'ubiquitin  (Bio)': 1, 'Energy of a photon (Gen Chem)': 1, 'transmembrane proteins (Bio)': 1, 'emirical vs molecular formulas + finding both (Gen Chem)': 1, 'Enthalpy and Entropy (Gen Chem)': 1, 'Chirality, meso compounds and identifying chiral carbons (Orgo)': 1, 'Transcription (Bio)': 1, 'Transposons (Bio)': 1}}}, 'Section Scores': {'graphType': 'Bar', 'data': {'2025-02-01': {'Chem/Phys Score': 123, 'CARS score': 122, 'Bio/Bio chem Score': 122, 'Psych/Soc Score': 125}, '2025-02-16': {'Chem/Phys Score': 120, 'CARS score': 124, 'Bio/Bio chem Score': 123, 'Psych/Soc Score': 123}, '2025-02-08': {'Chem/Phys Score': 125, 'CARS score': 125, 'Bio/Bio chem Score': 124, 'Psych/Soc Score': 126}, '2025-03-01': {'Chem/Phys Score': 124, 'CARS score': 123, 'Bio/Bio chem Score': 123, 'Psych/Soc Score': 125}}}}



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
    graphType: "Pie",
    data: {"2025-02-01":{"kreb cycle":5,"amino acids":12,"gestalt principles":2,"photosynthesis":3,"human anatomy":7,"nervous system":8,"enzymes":4},"2025-02-08":{"kreb cycle":4,"amino acids":10,"gestalt principles":1,"neurotransmitters":6,"cell division":3,"immune system":5,"molecular biology":2},"2025-02-16":{"kreb cycle":6,"amino acids":8,"gestalt principles":2,"photosynthesis":5,"human anatomy":9,"nervous system":4,"enzymes":7}}
  }
}
const graphTypes = ["bar", "line", "Pie"]

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
