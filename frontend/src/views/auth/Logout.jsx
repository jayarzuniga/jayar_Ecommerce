import { useEffect } from 'react'
import { logout, register } from '../../utils/auth'
import { Link } from 'react-router-dom'

function Logout() {
    useEffect(() =>{
        logout()
    }, [])
  return (
    <div>
        <main className="" style={{ marginBottom: 100, marginTop: 50 }}>
        <div className="container">
          {/* Section: Login form */}
          <section className="">
            <div className="row d-flex justify-content-center">
              <div className="col-xl-5 col-md-8">
                <div className="card rounded-5">
                  <div className="card-body p-4">
                    <h3 className="text-center">Login</h3>
                    <br />

                    <div className="tab-content">
                      <div
                        className="tab-pane fade show active"
                        id="pills-login"
                        role="tabpanel"
                        aria-labelledby="tab-login"
                      >
                        <h3>You have been logged out</h3>
                        <Link to="/register"className='btn-primary'>Register <i className="fas fa-user-plus"></i></Link>
                        <Link to="/login"className='btn-primary ms-2'>Login <i className="fas fa-sign-in"></i></Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default Logout