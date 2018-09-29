import { observable, action, computed, runInAction } from 'mobx'
import { notification, Modal } from 'antd'

import SolveService from '../../services/SolveService'

class SolveStore {
  @observable
  loading = true

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
  fetchTask = async (id, history) => {
    const task = await SolveService.getTaskByID(id)
      .then(resp => resp.data)
      .catch(err => {
        if (err.status === 403) {
          notification['error']({
            message: 'Forbidden!',
            description: 'You must going to completed the before task.'
          })
        }
        return { err }
      })

    if (task.err) {
      history.goBack()
      return
    }

    const testcases = await SolveService.getTestcasesByTaskID(id)
      .then(resp => resp.data)
      .catch(err => {
        console.log(err)
      })

    this.task = task
    this.testcases = testcases
    this.code = task.default_code
    this.loading = false
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
          message: `Your code's right!`,
          description: `You're pass this testcase, try to submit your code!`
        })
      }
    }
  }

  @action
  submit = async history => {
    const result = await SolveService.submitCode({
      taskID: this.task.id,
      code: this.code,
      duration: this.duration
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
          description: `Something are wrong in your algorithms, Let's fix it!.`
        })
      } else {
        if (result.answered) {
          Modal.success({
            title: `You've passed this task`,
            content: `You have passed this task, try a new task!`,
            onOk: () => {
              history.push(`/topics/${this.task.main_topic.id}`)
            }
          })
        } else {
          Modal.success({
            title: `Yeah! You're Pass`,
            content: `You're pass this task, Welcome!!`,
            onOk: () => {
              history.push(`/topics/${this.task.main_topic.id}`)
            }
          })
        }
      }
    }
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
