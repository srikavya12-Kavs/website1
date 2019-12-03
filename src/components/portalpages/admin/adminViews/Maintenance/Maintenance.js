import React, { Component } from 'react'
import Moment from 'react-moment'
import Modal from '../../../../utilities/Modal/Modal'
import SubmitButton from '../../../../Login/LoginComponents/SubmitButton'
import config from '../../../../../config'
import ApiService from '../../../../../services/api-service'
import AdminContext from '../../../../../contexts/AdminContext'
import DeleteModal from '../../../../utilities/Modal/DeleteModal'

const maintEndpoint = config.MAINTENANCE_ENDPOINT

class Maintenance extends Component {
    static contextType = AdminContext

    constructor(props) {
        super(props);
        this.state = {
            error: null
        };
    }

    componentDidMount(){
        ApiService.getData(
            maintEndpoint, 
            this.context.setData
        )        
    }

    componentWillUnmount(){
        this.context.setData([])
    }
    
    addMaintenanceType = (e) => {
        e.preventDefault()
        const newMaintenanceType = {
                maindescr: e.target.add_maint_type.value,
        }
        ApiService.postData(
            maintEndpoint, 
            newMaintenanceType, 
            this.context.updateData, 
            this.context.hideModal
        )  
        e.target.add_maint_type.value = '' 
    }

    updateData = (e) => {
        e.preventDefault()
        const id = this.context.id
        let updatedContent = {}

        if(e.target.maint_type.value !== ''){
            updatedContent.maindescr = e.target.maint_type.value
        }

        ApiService.updateDataHalf(maintEndpoint, id, updatedContent)
            .then(res => {
                ApiService.getDataHalf(maintEndpoint)
                    .then(data => {
                        this.context.setData(data)
                        this.context.hideUpdate()
                    })
            })
            .catch(error => {
                console.log(error)
            })
    }

    deleteMaintenance = (id) => {
        this.context.deleteData(id)
        ApiService.deleteData(
            maintEndpoint, 
            id, 
            this.context.setData
        )
        this.context.hideDelete()
    }

    render(){  
        const context = this.context
        return (
            <>
            <DeleteModal
                props={context}
                endpoint={maintEndpoint}
                deleteFn={this.deleteMaintenance}
            />
            <Modal className='update-modal' show={context.update}>
                    <div className='update-modal-grid'>
                        <h3>Update {context.name}</h3>
                        <form className='form-group' onSubmit={(e) => this.updateData(e)}>
                            <div className='form-group'>
                                <label htmlFor='maint_type'></label>
                                <input
                                    id='maint_type'
                                    name='maint_type'
                                    placeholder='Update Maintenance Type'
                                    type='text'
                                />
                            </div>
                            <input className='update-btn' type='submit' value="Update"></input>
                        </form>
                        <button className='cancel-btn' onClick={context.hideUpdate}>Cancel</button> 
                    </div>
                </Modal>
                <Modal className='add-modal' show={context.show} >
                    <form 
                        className= 'add-content'
                        onSubmit={(e) => this.addMaintenanceType(e)}
                    >
                        <h3>Add a Maintenance Type</h3>
                        <div className='form-group'>
                            <label htmlFor='promotion_name'></label>
                            <input 
                                id='add_maint_type'
                                name='add_main_type'
                                placeholder='Maintenance Type'
                                type='text'
                            />
                        </div>
                        <SubmitButton className='submit-content' text='Save'/>
                    </form>
                    <button className='cancel-btn' onClick={context.hideModal}>Cancel</button>
                </Modal>

                <div className='data-container'>
                    <h3>Maintenance</h3>
                    <button className='add-btn' onClick={context.showModal}>Add Maintenance Type</button>
                    <table className='data-table'>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Date Created</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {context.data.map(m => (
                            <tr key={m.id}>
                                <td>{m.maindescr}</td>
                                <td>
                                    <Moment format="YYYY/MM/DD">{m.created_at}</Moment>
                                </td>
                                <td>
                                    <button className='update-btn' onClick={() => context.updateUpdate(m.maindescr, m.id)}>Update</button>
                                </td>
                                <td>
                                    <button className='delete-btn' onClick={() => context.updateDelete(m.maindescr, m.id)}>Delete</button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>
        )
    }
}

export default Maintenance