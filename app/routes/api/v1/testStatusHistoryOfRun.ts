import TestRunsController from '@controllers/testRuns.controller'
import {LoaderFunctionArgs} from '@remix-run/node'
import {API} from '~/routes/utilities/api'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  errorResponseHandler,
  responseHandler,
} from '~/routes/utilities/responseHandler'
import {checkForRunId, checkForTestId} from '../../utilities/utils'

export async function loader({params, request}: LoaderFunctionArgs) {
  try {
    await getUserAndCheckAccess({
      request,
      resource: API.GetTestStatusHistoryInRun,
    })

    const url = new URL(request.url)
    const searchParams = Object.fromEntries(url.searchParams.entries())
    const testId = Number(searchParams['testId'])
    const runId = Number(searchParams['runId'])

    if (!checkForTestId(testId)) {
      return responseHandler({
        error: 'Invalid param testId',
        status: 400,
      })
    }

    if (!checkForRunId(runId)) {
      return responseHandler({
        error: 'Invalid param runId',
        status: 400,
      })
    }
    const testStatusData = await TestRunsController.getTestStatusHistoryOfRun({
      runId,
      testId,
    })

    return responseHandler({data: testStatusData, status: 200})
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}
