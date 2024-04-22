import {useState, useEffect} from "react";
import Sidebar from "./Sidebar";
import apiInstance from "../../utils/axios";
import UserData from "../plugin/UserData";
import Swal from "sweetalert2";
import moment from "moment";

function CustomerNotification() {
    const [notification, setNotification] = useState([]);
    const fetchNoti = () => {
        apiInstance
            .get(`customer/notification/${UserData().user_id}/`)
            .then((res) => {
                setNotification(res.data);
                console.log(res.data);
                
            })
            .catch((err) => {
                console.log(err);
            });
    }

    useEffect (()=>{
        fetchNoti()
    },[])

    const markNotiAsSeen = ( notiId) => {
        apiInstance
        .get(`customer/notification/${UserData().user_id}/${notiId}/`)
        .then((res) => {
            fetchNoti()

        })

        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Notification marked as seen",
            showConfirmButton: false,
            timer: 2000,
        });

    }

    return (
        <main className="mt-5">
            <div className="container">
                <section className="">
                    <div className="row">
                        <Sidebar/>

                        <div className="col-lg-9 mt-1">
                            <section className="">
                                <main className="mb-5" style={{}}>
                                    <div className="container px-4">
                                        <section className="">
                                            <h3 className="mb-3">
                                                <i className="fas fa-bell" /> Notifications{" "}
                                            </h3>
                                            <div className="list-group">

                                                {notification?.map((n, index) => (
                                                    <a
                                                        href="#"
                                                        className="list-group-item list-group-item-action"
                                                        key={index}
                                                    >
                                                        <div className="d-flex w-100 justify-content-between">
                                                            <h5 className="mb-1">Order Confirmed</h5>
                                                            <small className="text-muted">{moment(n.date).format("MMM DD, YYYY")}</small>
                                                        </div>
                                                        <p className="mb-1">
                                                            Your order has been confirmed.
                                                        </p>
                                                        
                                                        <button 
                                                        className="btn btn-success mt-3"
                                                        onClick={() => markNotiAsSeen(n.id)}
                                                        ><i className="fas fa-eye"></i>
                                                        </button>

                                                    </a>
                                                ))}

                                                {notification?.length === 0 && (
                                                    <div className="alert alert-info" role="alert">
                                                        No notification yet
                                                    </div>
                                                )}


                                            </div>
                                        </section>
                                    </div>
                                </main>
                            </section>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default CustomerNotification;
