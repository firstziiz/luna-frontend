import { observable, action } from 'mobx'
import { message } from 'antd'
import TaskService from '../../services/TaskService'
import TopicService from '../../services/TopicService'

class AdminProblemsStore {
  @observable
  loading = false

  @observable
  topics = []

  @observable
  levels = []

  initialData = async () => {
    this.loading = true
    let topics = await TopicService.getAllTopic().then(resp => resp.data)
    let levels = await TopicService.getAllLevel().then(resp => resp.data)
    this.topics = topics
    this.levels = levels
    this.loading = false
  }

  /*
    'TASK_LIST',
    'TASK_ADD'
  */
  @observable
  page = 'TASK_LIST'

  @action
  setPage = page => {
    this.page = page
  }

  /* Task List Page */
  @observable
  tasks = []

  @action
  fetchAllTasks = async () => {
    let tasks = await TaskService.getAllTasks().then(resp => resp.data)
    this.tasks = tasks
  }

  /* Task Add Page */
  @observable
  task = {
    task_name: '',
    task_desc: '',
    input_desc: '',
    output_desc: '',
    constrain_desc: '',
    examples: '',
    default_code: '',
    enable: true,
    order: null,
    main_topic: null,
    secondary_topics: [],
    // ชั่วคราว
    topic: null,
    level: null,
    task_type: 'PRACTICE'
  }

  @action
  setTask = (field, value) => {
    this.task[field] = value
  }

  @observable
  testcases = [
    {
      test: '',
      expected_output: ''
    }
  ]

  @action
  addTestcase = () => {
    this.testcases.push({
      test: '',
      expected_output: ''
    })
  }

  @action
  removeTestcase = () => {
    this.testcases.pop()
  }

  @action
  setTestcase = (index, field, value) => {
    this.testcases[index][field] = value
  }

  @action
  addTask = async () => {
    try {
      message.loading('กำลังเพิ่มโจทย์ กรุณารอสักครู่')
      let topic_level = await TopicService.getAllTopicLevel(this.task.topic, this.task.level).then(
        resp => resp.data[0]
      )

      let order = null
      if (this.task.task_type === 'PRACTICE') {
        order = await TaskService.getLastOfOrderInMainTopic(topic_level.pk).then(
          resp => resp.data.order
        )
        // force to next
        order = order + 1
      } else {
        order = null
      }

      let task = await TaskService.createTask({
        task_name: this.task.task_name,
        task_desc: this.task.task_desc,
        input_desc: this.task.input_desc,
        output_desc: this.task.output_desc,
        constrain_desc: this.task.constrain_desc,
        examples: this.task.examples,
        default_code: this.task.default_code,
        enable: true,
        order: order,
        main_topic: topic_level.pk,
        secondary_topics: []
      }).then(resp => resp.data)

      await Promise.all(
        this.testcases.map(async testcase => {
          await TaskService.createTestcase({
            ...testcase,
            is_hidden: false,
            task: task.id
          })
        })
      )

      message.success('เพิ่มโจทย์สำเร็จแล้ว! กลับสู่หน้ารวมโจทย์เพื่อดูโจทย์ที่สร้าง')
      this.testcases = [
        {
          test: '',
          expected_output: ''
        }
      ]
      this.task = {
        task_name: '',
        task_desc: '',
        input_desc: '',
        output_desc: '',
        constrain_desc: '',
        examples: '',
        default_code: '',
        enable: true,
        order: null,
        main_topic: null,
        secondary_topics: [],
        // ชั่วคราว
        topic: null,
        level: null
      }
    } catch (err) {
      message.error('เกิดปัญหา! ไม่สามารถสร้างโจทย์ได้ กรุณาติดต่อแอดมิน')
    }
  }
}

export default new AdminProblemsStore()
