// TODO use ConfigService getTestRailStatusSkipped, getTestRailStatusFailed, 
//    and getTestRailStatusPassed Instead of it 2, 5, 1

const RESULT_STATUS_FAIL = 5;
const RESULT_STATUS_SKIP = 2;
const RESULT_STATUS_PASS = 1;


class ResultsAggregator {


  /**
   *
   * @param {cytrPostData}
   * @returns {*}
   */
  aggregateDuplicateResults(cytrPostData) {
    // Replace multiple occurrences of test cases with one output summarizing case, aggregation rules are;
    // Fail trumps all, anything with a failed leads to the first failed item is the one emitted
    // If no mixed outcome, the same result is passed through
    // Pass trumps skip
    // If all test pass. The last comment is the one emitted.
    // if all pass or skip modify the comment statement with the prefix of `Summarization of {n} Cypress tests` 
    const emitPostData = []
    const mergedResults = {} // this is a map of case_id to merged result object

    cytrPostData.forEach((postData) => {
        const { case_id, status_id, comment, elapsed, screenshotPaths } = postData;
        
        if (Object.hasOwnProperty.call(mergedResults, case_id)) {
            if (status_id === RESULT_STATUS_PASS) {
                mergedResults[case_id].countPass += 1;
            } else if (status_id === RESULT_STATUS_FAIL) {
                mergedResults[case_id].countFail += 1;
            } else if (status_id === RESULT_STATUS_SKIP) {
                mergedResults[case_id].countSkip += 1;
            }
            // If one case failed don't process additional cases, Fail trumps all
            if (mergedResults[case_id].status_id !== RESULT_STATUS_FAIL) { 
                // If the current case is a skip then don't processing it
                if (status_id !== RESULT_STATUS_SKIP) { 
                    mergedResults[case_id].status_id = status_id;
                    mergedResults[case_id].comment = comment;
                    mergedResults[case_id].elapsed = elapsed;
                    mergedResults[case_id].screenshotPaths = screenshotPaths;                    
                }
            }
        } else { // a new case to setup
            mergedResults[case_id] = {
                ...postData, 
                countPass: (status_id === RESULT_STATUS_PASS ? 1 : 0),
                countFail: (status_id === RESULT_STATUS_FAIL ? 1 : 0), 
                countSkip: (status_id === RESULT_STATUS_SKIP ? 1 : 0),
              }; 
        }
    });
    
    Object.keys(mergedResults).forEach(case_id => {
      var newComment = `Summarization C${case_id} has ` 
      + `${mergedResults[case_id].countPass} Passing, ` 
      + `${mergedResults[case_id].countFail} Failing, `
      + `and ${mergedResults[case_id].countSkip} Skipped `
      + `Cypress tests\n\n${mergedResults[case_id].comment}`;
    // TODO Always preserved if testrail.runIncludeAll is true << needs testing
    
      var resultEntry = {
        case_id, 
        ...mergedResults[case_id],
        comment: newComment,
      };
      emitPostData.push(resultEntry);
    });
    return emitPostData
  }
}

module.exports = ResultsAggregator;