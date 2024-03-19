import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import apiInstance from '../../utils/axios';

function CreatePassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [searchParam] = useSearchParams();
    const navigate = useNavigate();

    const otp = searchParam.get('otp');
    const uidb64 = searchParam.get('uidb64');

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('Password does not match');

            return;
        }

        const formData = new FormData();
        formData.append('password', password);
        formData.append('otp', otp);
        formData.append('uidb64', uidb64);

        try {
            const response = await apiInstance.post('user/password-change/', formData);
            console.log(response.data);
            alert("Password Changed Successfully")
            navigate('/login');
        } catch (error) {
            alert('An error occurred while trying to change password:', error);
           
        }
    };

    return (
        <main className="" style={{ marginBottom: 100, marginTop: 50 }}>
        <div className="container">
            {/* Section: Login form */}
            <section className="">
                <div className="row d-flex justify-content-center">
                    <div className="col-xl-5 col-md-8">
                        <div className="card rounded-5">
                            <div className="card-body p-4">
                                <h3 className="text-center">Forgot Password</h3>
                                <br />

                                <div className="tab-content">
                                    <div
                                        className="tab-pane fade show active"
                                        id="pills-login"
                                        role="tabpanel"
                                        aria-labelledby="tab-login"
                                    >
                                        <form onSubmit={handlePasswordSubmit}>
                                            {/* Email input */}
                                            <div className="form-outline mb-4">
                                                <label className="form-label" htmlFor="Full Name">
                                                    Email Address
                                                </label>
                                                <input
                                                    type="text"
                                                    id="password"
                                                    name="New Password"
                                                    className="form-control"
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />
                                            </div>

                                            <div className="form-outline mb-4">
                                                <label className="form-label" htmlFor="Full Name">
                                                    Email Address
                                                </label>
                                                <input
                                                    type="text"
                                                    id="password2"
                                                    name="Confirm Password"
                                                    className="form-control"
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                />
                                            </div>

                                            <div className="text-center">
                                                <button type="submit" className='btn btn-primary w-100'>Reset Password <i className='fa fa-paper-plane'></i></button>
                                            </div>

                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </main>
    );
}

export default CreatePassword;
