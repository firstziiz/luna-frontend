import React from 'react'
import styled from 'styled-components'
import requireAuth from '../utils/requireAuth'
import TopicService from '../services/TopicService'
import { Link } from 'react-static'
import Layout from '../components/Core/Layout'

import DataTypeImage from '../static/images/data-type.png'
import StringImage from '../static/images/string.png'
import ArrayImage from '../static/images/array.png'
import LoopImage from '../static/images/loop.png'
import ConditionImage from '../static/images/condition.png'
import DataStructureImage from '../static/images/data-structure.png'

const getImageFromType = type => {
  switch (type) {
    case 'Data Type':
      return DataTypeImage
    case 'String':
      return StringImage
    case 'Array':
      return ArrayImage
    case 'Loop':
      return LoopImage
    case 'Condition':
      return ConditionImage
    case 'Data Structure':
      return DataStructureImage
  }
}

const CardTask = styled.div`
  border-radius: 0.9375rem !important;
  filter: drop-shadow(0rem 0.25rem 0.25rem rgba(0, 0, 0, 0.1));
`
const CardBody = styled.div`
  padding: 0.5rem !important;
`
const CardContent = styled.div`
  color: #00c0cc;
`
const Difficulty = styled.div`
  color: black;
  display: inline;
`
const Solve = styled.div`
  background-color: #fff !important;
  border: 0.0625rem solid #7498e9;
  color: #7498e9;
  font-size: 1rem;
  margin-top: 0.725rem;
  margin-left: 1rem;
`

const Solved = styled.div`
  background-color: #7498e9 !important;
  border: 0.0625rem solid #7498e9;
  color: #fff;
  font-size: 1rem;
  margin-top: 0.725rem;
  margin-left: 1rem;
`

const SpanDiff = styled.span`
  font-size: 0.875rem;
`

const TopicImage = styled.img`
  filter: drop-shadow(0rem 0.5rem 0.25rem rgba(0, 0, 0, 0.1));
`

const BGColor = styled.div`
  width: 100%;
  height: 15.5rem;
  background-color: #29406b;
  margin: 0;
  padding: 0;
`
const Header = styled.div`
  color: #fff;
  font-size: 1.875rem;
`
const SubHeader = styled.div`
  color: #fff;
  font-size: 1rem;
`

@requireAuth()
class TaskListPage extends React.Component {
  state = {
    loading: true,
    topic: {},
    tasks: [],
    level: ['Beginner', 'Intermediate', 'Advance'],
    solve: ['Solved', 'Unsolved'],
    levelresult: '',
    solveresult: ''
  }

  async componentWillMount() {
    this.fetchData()
  }

  fetchData = async () => {
    const { match } = this.props
    const topic = await TopicService.getTopic(match.params.topicID).then(resp => resp.data)
    const tasks = await TopicService.getTaskFromTopicID(match.params.topicID).then(
      resp => resp.data
    )
    this.setState({
      topic,
      tasks,
      loading: false
    })
  }

  //ส่วนของตัวการ์ด และ เช็คชื่อ Topic กับ Filter Level ans Solved
  card = () => (
    <div>
      {this.state.tasks.map((task, index) =>
        task.topics.map(
          topic =>
            topic.topic.topic_name == this.state.topic.topic_name ? (
              <CardTask className="card mt-3">
                <Link to={`/tasks/${task.pk}`} key={index}>
                  <CardBody className="card-body">
                    <div className="row">
                      <CardContent className="col-sm-10 pl-5">
                        <h6 className="mb-2 font-weight-bold"> {task.task_name} </h6>
                        <Difficulty className="card-text">
                          <SpanDiff>Difficulty : {topic.level.level_name}</SpanDiff>
                        </Difficulty>
                      </CardContent>
                      <div className="col-sm-2">
                        <Solve className="badge badge-pill font-weight-normal"> Solve </Solve>
                      </div>
                    </div>
                  </CardBody>
                </Link>
              </CardTask>
            ) : null
        )
      )}
    </div>
  )

  render() {
    return (
      <Layout>
        <BGColor>
          {!this.state.loading && (
            <div className="container-fluid">
              <div className="row">
                <div className="col-sm-3" />
                <div className="col-sm-6 mt-4 mb-3">
                  <div className="row mb-2">
                    <div className="col-sm-2" />
                    <div className="col-sm-3 pr-1">
                      <TopicImage
                        src={getImageFromType(this.state.topic.topic_name)}
                        height="150"
                        width="150"
                        className="rounded"
                      />
                    </div>
                    <div className="col-sm-5 pt-5 pl-1">
                      <Header className="mb-0 font-weight-bold">
                        {this.state.topic.topic_name}
                      </Header>
                      <SubHeader>Lorem Ipsum is not simply random text.</SubHeader>
                    </div>
                    <div className="col-sm-2" />
                  </div>
                </div>
                <div className="col-sm-3" />
              </div>
              <div className="row mb-4">
                <div className="col-sm-3" />
                <div className="col-sm-6">{this.card()}</div>
                <div className="col-sm-3" />
              </div>
            </div>
          )}
        </BGColor>
      </Layout>
    )
  }
}

export default TaskListPage
