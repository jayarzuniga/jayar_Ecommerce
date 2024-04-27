import React from 'react';
import Sidebar from './Sidebar';
import { Link } from 'react-router-dom';

function Orders() {
    return (
        <div className="container-fluid" id="main">
            <div className="row row-offcanvas row-offcanvas-left h-100">
                <Sidebar />
                <div className="col-md-9 col-lg-10 main mt-4">
                    <h4>
                        <i className="bi bi-cart-check-fill"></i> All Orders
                    </h4>
                    <div className="dropdown">
                        <button
                            className="btn btn-secondary dropdown-toggle btn-sm mt-3 mb-4"
                            type="button"
                            id="dropdownMenuButton1"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            Filter <i className="fas fa-sliders"></i>
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                            <li>
                                <a className="dropdown-item" href="#">
                                    Payment Status: Paid
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#">
                                    Payment Status: Unpaid
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#">
                                    Payment Status: Pending
                                </a>
                            </li>
                            <hr />
                            <li>
                                <a className="dropdown-item" href="#">
                                    Date: Latest
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#">
                                    Date: Oldest
                                </a>
                            </li>
                            <hr />
                            <li>
                                <a className="dropdown-item" href="#">
                                    Delivery Status: Shipped
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#">
                                    Delivery Status: Processing
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#">
                                    Delivery Status: Arrived
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#">
                                    Delivery Status: Delivered
                                </a>
                            </li>
                        </ul>
                    </div>
                    <table className="table">
                        <thead className="table-dark">
                            <tr>
                                <th scope="col">#Order ID</th>
                                <th scope="col">Total</th>
                                <th scope="col">Payment Status</th>
                                <th scope="col">Delivery Status</th>
                                <th scope="col">Date</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>

                            <tr>
                                <th scope="row">#trytrr</th>
                                <td>$100.90</td>
                                <td>Paid</td>
                                <td>Shipped</td>
                                <td>20th June, 2023</td>
                                <td>
                                    <Link to="/vendor/orders-detail/" className="btn btn-primary mb-1">
                                        <i className="fas fa-eye"></i>
                                    </Link>
                                </td>
                            </tr>


                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Orders;
