import React, {Component} from 'react'
import GeoSyriaUI from './GeoSyriaUI';
import GeoSyriaContainer from './GeoSyriaContainer'
import {connect} from 'react-redux'
import * as Actions from './data/ActionCreators'
import {DATA_TYPES} from './data/Types'
import {ReturnButton} from "./components/ReturnButton";

const mapState = storeData => ({...storeData})

const mapDispatch = {
    ...Actions
}

export default connect(mapState, mapDispatch)(class extends Component {
    render() {
        return <React.Fragment>
            {this.props.coordinate && <GeoSyriaUI {...this.props} />}
            {this.props.coordinate && <GeoSyriaContainer coordinate={this.props.coordinate} filter={this.props.filter}
                                                         details={this.props.details}/>}

            <div style={{position: 'absolute', top: '10vh', right: '3vw'}}>
                <ReturnButton/>
            </div>
        </React.Fragment>
    }

    componentDidMount() {
        this.props.getData(DATA_TYPES.COORDINATION)
        this.props.getTotal(DATA_TYPES.SUM)
    }
})