import React from 'react';
import {getAuthenticatedHttpClient as getHttpClient} from '@edx/frontend-platform/auth';
import LoadingMessage from '../../components/LoadingMessage';
import {CouponTrace} from '../../data/urls';
import './CouponTraceList.css';

import {humanizeTime, jsonConvert} from '../../data/utils';

class CouponTraceList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            allCoupons: [],
            couponSearch: null,
            userSearch: null,
            username: true,
            message: true,
            email: false,
            lmsUserId: false,
            enterpriseName: false,
            courseID: false,
            enrollmentDate: false,
            metadata: false,
            error: '',
            last24HrRecord:0,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeCheckBox = this.handleChangeCheckBox.bind(this);
    }

    componentDidMount() {
        this.loadCoupons()
    }

    handleChangeCheckBox(evt) {
        this.setState({
            [evt.target.name]: evt.target.checked,
        });
    }




    handleChange(evt) {
        this.setState({
            [evt.target.name]: evt.target.value,
        });
    }

    checkSearch(CouponTraceUrl) {
        if (this.state.userSearch) {
            CouponTraceUrl = CouponTraceUrl + '?username=' + this.state.userSearch;
        }
        if (this.state.couponSearch && this.state.userSearch) {
            CouponTraceUrl = CouponTraceUrl + '&coupon_code=' + this.state.couponSearch;
        }
        else if (this.state.couponSearch) {
            CouponTraceUrl = CouponTraceUrl + '?coupon_code=' + this.state.couponSearch;
        }
        return CouponTraceUrl;
    }

    errorState = () => {
        this.setState({
            loading: false,
            error: "Sorry, please try again later",
            allCoupons:[],
            last24HrRecord:0
        });
    };

    loadCoupons = () => {
        let CouponTraceUrl = CouponTrace;
        CouponTraceUrl = this.checkSearch(CouponTraceUrl);
        getHttpClient().get(CouponTraceUrl).then(response => {
            if (response.data) {
                this.setState({
                    loading: false,
                    allCoupons: response.data.results,
                    last24HrRecord:response.data.results[0].last_24_hour_records
                });
            } else {
                this.errorState();
            }
        }).catch((error) => {
            this.errorState();
        });
    };


    render() {
        return (
            this.state.loading ? <LoadingMessage className="table-loading"/> : (
                    <React.Fragment>
                        <main role="main">
                            <div className="container-fluid">
                                <div
                                    className="row col-12 heading mt-20 mb-20 d-flex align-items-center justify-content-between">
                                    <div className="col-7 d-flex align-items-center justify-content-between">
                                        <div className="col-5 card text-center">
                                            <div className="card-body">
                                                <h1 className="card-text">{this.state.allCoupons.length}</h1>
                                                <p className="card-title">Total Coupon Errors</p>
                                            </div>
                                        </div>
                                        <div className="col-5 card text-center">
                                            <div className="card-body">
                                                <h1 className="card-text">{this.state.last24HrRecord}</h1>
                                                <p className="card-title">Errors In Last 24Hrs </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-5">
                                        <div className="input-group mb-2">
                                            <input type="text" className="search form-control" name="userSearch"
                                                   ref="userSearch"
                                                   onChange={this.handleChange}
                                                   placeholder="Search With Username"/>
                                        </div>
                                        <div className="input-group mb-2">
                                            <input type="text" className="search form-control" name="couponSearch"
                                                   ref="couponSearch"
                                                   onChange={this.handleChange}
                                                   placeholder="Search With Coupon Code"/>
                                        </div>
                                        <div className="input-group">
                                            <button onClick={this.loadCoupons}
                                                    className="btn btn-outline-dark">Search
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <h3 className="tableTitle">Apply Filters</h3>
                                        <div className="d-flex align-items-center">
                                            <div>
                                                <label className="customCheckmarkWrap">Email
                                                    <input className='checkbox-animated-inline'
                                                           checked={this.state.email}
                                                           type="checkbox" onClick={this.handleChangeCheckBox}
                                                           name="email"/>
                                                    <span className="checkmark"></span>
                                                </label>
                                            </div>
                                            <div>
                                                <label className="customCheckmarkWrap">Message
                                                    <input checked={this.state.message} type="checkbox"
                                                           onClick={this.handleChangeCheckBox} name="message"/>
                                                    <span className="checkmark"></span>
                                                </label>
                                            </div>
                                            <div>
                                                <label className="customCheckmarkWrap">LMS User ID
                                                    <input checked={this.state.lmsUserId} type="checkbox"
                                                           onClick={this.handleChangeCheckBox} name="lmsUserId"/>
                                                    <span className="checkmark"></span>
                                                </label>
                                            </div>
                                            <div>
                                                <label className="customCheckmarkWrap">Enterprise Name
                                                    <input checked={this.state.enterpriseName} type="checkbox"
                                                           onClick={this.handleChangeCheckBox} name="enterpriseName"/>
                                                    <span className="checkmark"></span>
                                                </label>
                                            </div>
                                            <div>
                                                <label className="customCheckmarkWrap">Course ID
                                                    <input checked={this.state.courseID} type="checkbox"
                                                           onClick={this.handleChangeCheckBox} name="courseID"/>
                                                    <span className="checkmark"></span>
                                                </label>
                                            </div>
                                            <div>
                                                <label className="customCheckmarkWrap">Attempted Enrollment Date
                                                    <input checked={this.state.enrollmentDate} type="checkbox"
                                                           onClick={this.handleChangeCheckBox} name="enrollmentDate"/>
                                                    <span className="checkmark"></span>
                                                </label>
                                            </div>
                                            <div>
                                                <label className="customCheckmarkWrap">Meta Data
                                                    <input checked={this.state.metadata} type="checkbox"
                                                           onClick={this.handleChangeCheckBox} name="metadata"/>
                                                    <span className="checkmark"></span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <div className="table-responsive">
                                            <table className="table">
                                                <thead>
                                                <tr>
                                                    {this.state.username ? <th scope="col">Username</th> : null}
                                                    {this.state.email ?<th scope="col">Email</th>: null}
                                                    {this.state.lmsUserId ? <th scope="col">LMS User ID</th> : null}
                                                    {this.state.enterpriseName ?
                                                        <th scope="col">Enterprise Name</th> : null}
                                                    <th scope="col">Coupon Code</th>
                                                    {this.state.courseID ? <th scope="col">Course ID</th> : null}
                                                    {this.state.enrollmentDate ?
                                                        <th scope="col">Enrollment Date</th> : null}
                                                    {this.state.message ? <th scope="col">Message</th> : null}
                                                    {this.state.metadata ? <th scope="col">Meta Data</th> : null}

                                                </tr>
                                                </thead>
                                                <tbody>
                                                {this.state.allCoupons && this.state.allCoupons.length
                                                    ? this.state.allCoupons.map((coupon, i) => {
                                                        return (
                                                            <tr key={i}>
                                                                {this.state.username ?
                                                                    <td className="user">{coupon.user.username}</td> : null}
                                                                {this.state.email ?<td className="user">{coupon.user.email}</td>: null}
                                                                {this.state.lmsUserId ?
                                                                    <td className="user">{coupon.user.lms_user_id}</td> : null}
                                                                {this.state.enterpriseName ?
                                                                    <td className="user">{coupon.learner_enterprise_name}</td> : null}
                                                                <td className="change-iner">{coupon.coupon_code}</td>
                                                                {this.state.courseID ?
                                                                    <td className="success-iner">{coupon.course}</td> : null}
                                                                {this.state.enrollmentDate ?
                                                                    <td className="success-iner">{humanizeTime(coupon.created)}</td> : null}
                                                                {this.state.message ?
                                                                    <td className="user">{coupon.message}</td> : null}
                                                                {this.state.metadata ?
                                                                    <td className="user">{jsonConvert(coupon.metadata)}</td> : null}
                                                            </tr>
                                                        );
                                                    })
                                                    : null}

                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </React.Fragment>
            )
        )
    }
}

export default CouponTraceList
