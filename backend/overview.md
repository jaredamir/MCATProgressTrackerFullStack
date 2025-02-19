
### Ideas 
- filter based on single test vs all tests

### Analytics
- View analytics of specific test (Per topic vs Overall in the test)
  - Comparative amounts of issues per question type
  - Comparative amounts of issues per reason for missing
  - Count of topics (either in general or the ones with "lacking topic understanding/Content memorization")
  - Relative number of missed questions per section
  - Actual score taking into consideration the number of "right answer wrong logic" checks
  - 
- View analytics overall
  - Line graphs of each section overtime
  - Line graph of overall score
  - Show what performance decreased since last time
    - Frequency of a topic
    - Frequency of a reason for missing
    - Frequency of a type of passage

### App Structure
- Get all the analytics at once and store them in a JSON format
- Store in a sqlite cache
- 
### Template Model

**JSON**
{
  analytic1: {
    graphType: "Bar"
    data: {
      test1: [{ section1: {item(label): dataPoint}, section2: {item(label): dataPoint}, ... }],
      test2: [{ section1: {item(label): dataPoint}, section2: {item(label): dataPoint}, ... }],
    }
  },
  analytic2: {
    graphType: "Line",
    data: [{
      section1: {item(label): dataPoint}, section2: {item(label): dataPoint}, ...
    }]
  },
 analytic3: {
    graphType: "Line",
    /*Multiple sets in the array are for comparison graphs*/
    data: [{
      section1: {item(label): dataPoint}, section2: {item(label): dataPoint}, ...
      section1: {item(label): dataPoint}, section2: {item(label): dataPoint}, ...
    }]
  }
}

Overview Interpretation:

