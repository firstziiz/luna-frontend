import { observable, action, computed, runInAction } from 'mobx'
import { notification } from 'antd'
import SolveService from '../../services/SolveService'

class SolveStore {
  @observable
  task = {}

  @observable
  testcases = []

  @observable
  result = []

  @observable
  error = {}

  @observable
  code = ``

  @observable
  duration = 0

  @action
  fetchTask = async id => {
    const task = await SolveService.getTaskByID(id)
      .then(resp => resp.data)
      .catch(err => {
        console.log(err)
      })

    const testcases = await SolveService.getTestcasesByTaskID(id)
      .then(resp => resp.data)
      .catch(err => {
        console.log(err)
      })

    this.task = task
    this.testcases = testcases
    this.code = task.default_code
  }

  @action
  changeCode = code => {
    this.code = code
  }

  @action
  runTest = async () => {
    const result = await SolveService.testCode({
      taskID: this.task.id,
      code: this.code
    }).then(resp => resp.data)

    if (result.submission.err) {
      notification['error']({
        message: 'Error!',
        description: 'See error statement in console panel.'
      })
      this.resultPanelState = 'CONSOLE'
      this.error = result.submission.err
    } else {
      this.error = {}
      this.resultPanelState = 'TESTCASE'
      this.result = result.submission.result
      if (result.submission.pass === false) {
        notification['warning']({
          message: 'Something Wrong!',
          description: `Something are wrong in testcase, Let's fix it!.`
        })
      } else {
        notification['success']({
          message: `Yeah! You're Pass`,
          description: `You're pass this task, try to submit your code!`
        })
      }
    }
  }

  @action
  submit = () => {
    console.log('submit!')
  }

  @observable
  resultPanelState = 'TESTCASE'

  @action
  setResultPanelState = state => {
    this.resultPanelState = state
  }

  @action
  startDuration = () => {
    setInterval(
      () =>
        runInAction(() => {
          this.duration += 1
        }),
      1000
    )
  }

  @computed
  get durationInTime() {
    if (this.duration > 0) {
      return `${parseInt(this.duration / 60, 10) < 10 ? 0 : ''}${parseInt(
        this.duration / 60,
        10
      )} : ${this.duration % 60 < 10 ? 0 : ''}${this.duration % 60}`
    } else {
      return '00 : 00'
    }
  }
}

export default new SolveStore()
