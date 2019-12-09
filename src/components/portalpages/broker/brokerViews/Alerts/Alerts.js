import React, { Component } from 'react'
import Moment from 'react-moment'
import config from '../../../../../config'
import ApiService from '../../../../../services/api-service'

const endpoint = `${config.API_ENDPOINT}/assets/0/assetcomments`
const commEndpoint = `${config.API_ENDPOINT}/commtypes`

class Alerts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            alerts: [],
            commtypes: []
        }
    }

    setAlerts = alerts => {
        this.setState({
            alerts
        })
    }

    setComms = commtypes => {
        this.setState({
            commtypes
        })
    }

    componentDidMount(){
        ApiService.getDataHalf(endpoint)
            .then(data => {
                console.log(data)
                this.setAlerts(data.assetcomments)
            }) 
            .catch(error => {
                console.log(error)
            }) 
        ApiService.getDataHalf(commEndpoint)
            .then(data => {
                console.log(data)
                this.setComms(data)
            }) 
            .catch(error => {
                console.log(error)
            })         
    }

    render(){  
        return (
            <div className='data-container'>
                <h3>Alerts</h3>
                <table className='data-table'>
                    <thead>
                        <tr>
                            <th>Comment Type</th>
                            <th>Comment</th>
                            <th>Alarm</th>
                            <th>Request Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.alerts.map(a => (
                        <tr key={a.data.id}>
                            <td>
                                {this.state.commtypes.map(c => {
                                    if(c.id === a.data.commtype_id){
                                        return c.commdesc
                                    }
                                })}
                            </td>
                            <td>{a.data.assetcomment}</td>
                            <td>
                                {(a.data.alarm) ? 'True' : 'False'}
                            </td>
                            <td>
                                <Moment format="YYYY/MM/DD">{a.data.requestdate}</Moment>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default Alerts