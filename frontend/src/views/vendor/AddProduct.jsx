import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import apiInstance from '../../utils/axios'
import UserData from "../plugin/UserData";
import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment';
import Swal from 'sweetalert2';

function AddProduct() {
    const userData = UserData();
    const navigate = useNavigate();

    const [product, setProduct] = useState({
        title: '',
        image: null,
        description: '',
        price: '',
        old_price: '',
        shipping_amount: '',
        stock_qty: '',
        vendor: userData?.vendor_id,
    })

    const [specification, setSpecification] = useState([{
        title: '',
        content: '',
    }])

    const [colors, setColors] = useState([{
        name: '',
        color_code: '',
    }])

    const [sizes, setSizes] = useState([{
        name: '',
        price: '',
    }])

    const [gallery, setGallery] = useState([{
        image:null,
    }])

    const [category, setCategory] = useState([])
    

    const handleAddMoreButton = (setStateFunction) => {
        setStateFunction((prevState) => [...prevState, {}])
    }

    const handleRemoveButton = (index, setStateFunction) => {
        setStateFunction((prevState) => {
            const newState = [...prevState]
            newState.splice(index, 1)
            return newState
        })
    }

    const handleInputChange = (index, field, value, setStateFunction) => {
            setStateFunction((prevState) => {
                const newState = [...prevState]
                newState[index][field] = value
                return newState
            })
        }

    const handleImageChange = (index, event, setStateFunction) => {
        const file = event.target.files[0]

        if(file) {
            const reader = new FileReader()

            reader.onloadend = () => {
                setStateFunction((prevState) => {
                    const newState = [...prevState]
                    newState[index].image  = {file, preview:reader.result}
                    return newState
                })
            }

            reader.readAsDataURL(file)
        }else{
            setStateFunction((prevState) => {
                const newState = [...prevState]
                newState[index].image = null
                newState[index].preview = null
                return newState
            })
        }
    }

    const handleProductInputChange = (event) => {
        setProduct({
            ...product,
            [event.target.name]: event.target.value
        })
        console.log(product);
    }

    const handleProductFileChange = (event) => {
        const file = event.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setProduct({
                    ...product,
                    image: {
                        file: event.target.files[0],
                            preview:reader.result
                    }
                })
            }
            reader.readAsDataURL(file)
        }
    }

    useEffect(() => {
        apiInstance.get('/category/').then((res) => {
                setCategory(res.data);
            })
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()

        const formdata = new FormData()

        Object.entries(product).forEach(([key, value]) => {
            if (key === 'image' && value){
                formdata.append(key, value.file)
            } else {
                formdata.append (key, value)
            }
        })

        specification.forEach((spec, index) => {
            Object.entries(spec).forEach(([key, value]) => {
                formdata.append(`specification[${index}][${key}]`, value)
            })
        })

        colors.forEach((color, index) => {
            Object.entries(color).forEach(([key, value]) => {
                formdata.append(`color[${index}][${key}]`, value)
            })
        })

        sizes.forEach((size, index) => {
            Object.entries(size).forEach(([key, value]) => {
                formdata.append(`size[${index}][${key}]`, value)
            })
        })

        gallery.forEach((item, index) => {
            if (item.image) {
                formdata.append(`gallery[${index}][image]`, item.image.file)
            }
        })

        const response = await apiInstance.post('/vendor-create-product/', formdata, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })

        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: "Product Added Successfully",
            showConfirmButton: false,
            timer: 1500
          });

        navigate('/vendor/products')
    }
    
    

    return (
        <div className="container-fluid" id="main">
            <div className="row row-offcanvas row-offcanvas-left h-100">
                
                <Sidebar />

                <div className="col-md-9 col-lg-10 main mt-4">
                    <div className="container">

                        <form onSubmit={handleSubmit}>
                        <div className="main-body">
                            <div className="tab-content" id="pills-tabContent">
                                <div
                                    className="tab-pane fade show active"
                                    id="pills-home"
                                    role="tabpanel"
                                    aria-labelledby="pills-home-tab"
                                >
                                    <div className="row gutters-sm shadow p-4 rounded">
                                        <h4 className="mb-4">Product Details</h4>
                                        <div className="col-md-12">
                                            <div className="card mb-3">
                                                <div className="card-body">

                                                        <div className="row text-dark">
                                                            <div className="col-lg-6 mb-2">
                                                                <label htmlFor="" className="mb-2">
                                                                    Product Thumbnail
                                                                </label>
                                                                <input
                                                                    type="file"
                                                                    className="form-control"
                                                                    name="image"
                                                                    onChange={handleProductFileChange}
                                                                />
                                                            </div>
                                                            <div className="col-lg-6 mb-2 ">
                                                                <label htmlFor="" className="mb-2">
                                                                    Title
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="title"
                                                                    value={product.title || ''} 
                                                                    onChange={handleProductInputChange}
                                                                />
                                                            </div>
                                                            <div className="col-lg-12 mb-2">
                                                                <label htmlFor="" className="mb-2">
                                                                    Description
                                                                </label>
                                                                <textarea
                                                                    className="form-control"
                                                                    id=""
                                                                    cols={30}
                                                                    rows={10}
                                                                    defaultValue={""}
                                                                    name="description"
                                                                    value={product.description || ''} 
                                                                    onChange={handleProductInputChange}
                                                                />
                                                            </div>
                                                            <div className="col-lg-12 mb-2">
                                                                <label htmlFor="" className="mb-2">
                                                                    Category
                                                                </label>
                                                                <select
                                                                    className="select form-control"
                                                                    id=""
                                                                    name="category"
                                                                    value={product.category || ''} 
                                                                    onChange={handleProductInputChange}
                                                                >
                                                                    <option value="">- Select -</option>
                                                                    {category?.map((c, index) => (
                                                                        <option key={index} value={c.id}>{c.title}</option>
                                                                    ))}
                                                                    
                                                                    
                                                                </select>
                                                            </div>
                                                            <div className="col-lg-6 mb-2 ">
                                                                <label htmlFor="" className="mb-2">
                                                                    Sale Price
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="price"
                                                                    value={product.price || ''} 
                                                                    onChange={handleProductInputChange}
                                                                />
                                                            </div>
                                                            <div className="col-lg-6 mb-2 ">
                                                                <label htmlFor="" className="mb-2">
                                                                    Regular Price
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="old_price"
                                                                    value={product.old_price || ''} 
                                                                    onChange={handleProductInputChange}
                                                                />
                                                            </div>
                                                            <div className="col-lg-6 mb-2 ">
                                                                <label htmlFor="" className="mb-2">
                                                                    Shipping Amount
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="shipping_amount"
                                                                    value={product.shipping_amount || ''} 
                                                                    onChange={handleProductInputChange}
                                                                />
                                                            </div>
                                                            <div className="col-lg-6 mb-2 ">
                                                                <label htmlFor="" className="mb-2">
                                                                    Stock Qty
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="stock_qty"
                                                                    value={product.stock_qty || ''} 
                                                                    onChange={handleProductInputChange}
                                                                />
                                                            </div>
                                                        </div>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="tab-pane fade"
                                    id="pills-profile"
                                    role="tabpanel"
                                    aria-labelledby="pills-profile-tab"
                                >
                                    <div className="row gutters-sm shadow p-4 rounded">
                                        <h4 className="mb-4">Product Image</h4>
                                        <div className="col-md-12">
                                            <div className="card mb-3">
                                                <div className="card-body">
                                                    {gallery?.map((item, index) => (
                                                        <div className="row text-dark">
                                                        <div className="col-lg-6 mb-2">
                                                                {item.image && (
                                                                    <img 
                                                                    style={{width: '100%', height: '50%', borderRadius: '10px', objectFit: 'cover'}}
                                                                    src={item.image.preview}
                                                                    alt=""
                                                                    className="img-fluid" />
                                                                )}

                                                                {!item.image && (
                                                                    <img 
                                                                    style={{width: '100%', height: '200px', borderRadius: '10px', objectFit: 'cover'}}
                                                                    src="data:image/png;base64,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"
                                                                    alt=""
                                                                    className="img-fluid" />
                                                                )}
                                                            </div>
                                                            <div className="col-lg-3 mb-2">
                                                                <label htmlFor="" className="mb-2">
                                                                    Product Image
                                                                </label>
                                                                <input
                                                                    type="file"
                                                                    className="form-control"
                                                                    onChange={(event)=>handleImageChange(index, event, setGallery)}
                                                                />
                                                            </div>
                                                            <div className="col-lg-3 mt-2">
                                                                <button
                                                                    className='btn btn-danger mt-4'
                                                                    onClick={()=>handleRemoveButton(index, setGallery)}
                                                                >Remove</button>
                                                            </div>
                                                        </div>
                                                    ))}

                                                    {gallery < 1 && 
                                                        <h4>No Images Selected</h4>
                                                    }

                                                    <button 
                                                        className="btn btn-primary mt-5"
                                                        onClick={()=>handleAddMoreButton(setGallery)}
                                                    >
                                                        <i className="fas fa-plus" /> Add Image
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="tab-pane fade"
                                    id="pills-contact"
                                    role="tabpanel"
                                    aria-labelledby="pills-contact-tab"
                                >
                                    <div className="row gutters-sm shadow p-4 rounded">
                                        <h4 className="mb-4">Specifications</h4>
                                        <div className="col-md-12">
                                            <div className="card mb-3">
                                                <div className="card-body">
                                                    
                                                    {specification?.map((spec, index) => (
                                                        <div className="row text-dark">
                                                        <div className="col-lg-5 mb-2">
                                                            <label htmlFor="" className="mb-2">
                                                                Title
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                onChange={(event)=>handleInputChange(index, 'title', event.target.value, setSpecification)}
                                                                value={spec.title || ''}
                                                            />
                                                        </div>
                                                        <div className="col-lg-5 mb-2">
                                                            <label htmlFor="" className="mb-2">
                                                                Content
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                onChange={(event)=>handleInputChange(index, 'content', event.target.value, setSpecification)}
                                                                value={spec.content || ''}
                                                            />
                                                        </div>
                                                        <div className="col-lg-2 mt-2">
                                                            <button
                                                             className='btn btn-danger mt-4'
                                                             onClick={()=>handleRemoveButton(index, setSpecification)}
                                                             >Remove</button>
                                                        </div>
                                                        
                                                    </div>
                                                    ))}

                                                    {specification < 1 && 
                                                        <h4>No Specification Added</h4>
                                                    }

                                                    <button 
                                                        className="btn btn-primary mt-5"
                                                        onClick={()=>handleAddMoreButton(setSpecification)}
                                                    >
                                                        <i className="fas fa-plus" /> Add Specifications
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div
                                    className="tab-pane fade"
                                    id="pills-size"
                                    role="tabpanel"
                                    aria-labelledby="pills-size-tab"
                                >
                                    <div className="row gutters-sm shadow p-4 rounded">
                                        <h4 className="mb-4">Sizes</h4>
                                        <div className="col-md-12">
                                            <div className="card mb-3">
                                                <div className="card-body">

                                                    {sizes?.map((spec, index) => (
                                                        <div className="row text-dark">
                                                        <div className="col-lg-5 mb-2">
                                                            <label htmlFor="" className="mb-2">
                                                                Size
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Small, Medium, Large"
                                                                onChange={(event)=>handleInputChange(index, 'name', event.target.value, setSizes)}
                                                                value={spec.name || ''}
                                                            />
                                                        </div>
                                                        <div className="col-lg-5 mb-2">
                                                            <label htmlFor="" className="mb-2">
                                                                Price
                                                            </label>
                                                            <input
                                                                type="number"
                                                                placeholder="$20.00"
                                                                className="form-control"
                                                                onChange={(event)=>handleInputChange(index, 'price', event.target.value, setSizes)}
                                                                value={spec.price || ''}
                                                            />
                                                        </div>
                                                        <div className="col-lg-2 mt-2">
                                                            <button
                                                             className='btn btn-danger mt-4'
                                                             onClick={()=>handleRemoveButton(index, setSizes)}
                                                             >Remove</button>
                                                        </div>
                                                        
                                                    </div>
                                                    ))}

                                                    {sizes < 1 && 
                                                        <h4>No Sizes Added</h4>
                                                    }
                                                    

                                                    <button className="btn btn-primary mt-5" onClick={()=>handleAddMoreButton(setSizes)}>
                                                        <i className="fas fa-plus" /> Add Size
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="tab-pane fade"
                                    id="pills-color"
                                    role="tabpanel"
                                    aria-labelledby="pills-color-tab"
                                >
                                    <div className="row gutters-sm shadow p-4 rounded">
                                        <h4 className="mb-4">Color</h4>
                                        <div className="col-md-12">
                                            <div className="card mb-3">
                                                <div className="card-body">

                                                    {colors?.map((spec, index) => (
                                                        <div className="row text-dark">
                                                        <div className="col-lg-4 mb-2">
                                                            <label htmlFor="" className="mb-2">
                                                                Name
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Green"
                                                                onChange={(event)=>handleInputChange(index, 'name', event.target.value, setColors)}
                                                                value={spec.name || ''}
                                                            />
                                                        </div>
                                                        <div className="col-lg-4 mb-2">
                                                            <label htmlFor="" className="mb-2">
                                                                Code
                                                            </label>
                                                            <input
                                                                type="text"
                                                                placeholder="#f4f7f6"
                                                                className="form-control"
                                                                onChange={(event)=>handleInputChange(index, 'color_code', event.target.value, setColors)}
                                                                value={spec.color_code || ''}
                                                            />
                                                        </div>
                                                        <div className="col-lg-4 mt-2">
                                                            <button 
                                                                className="btn btn-danger mt-4"
                                                                onClick={()=>handleRemoveButton(index, setColors)}
                                                                >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                    ))}

                                                    {colors < 1 && 
                                                        <h4>No Colors Added</h4>
                                                    }

                                                    
                                                    <button 
                                                        className="btn btn-primary mt-5"
                                                        onClick={()=>handleAddMoreButton(setColors)}
                                                        >
                                                        <i className="fas fa-plus" /> Add Color
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <ul
                                        className="nav nav-pills mb-3 d-flex justify-content-center mt-5"
                                        id="pills-tab"
                                        role="tablist"
                                    >
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className="nav-link active"
                                                id="pills-home-tab"
                                                data-bs-toggle="pill"
                                                data-bs-target="#pills-home"
                                                type="button"
                                                role="tab"
                                                aria-controls="pills-home"
                                                aria-selected="true"
                                            >
                                                Basic Information
                                            </button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className="nav-link"
                                                id="pills-profile-tab"
                                                data-bs-toggle="pill"
                                                data-bs-target="#pills-profile"
                                                type="button"
                                                role="tab"
                                                aria-controls="pills-profile"
                                                aria-selected="false"
                                            >
                                                Gallery
                                            </button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className="nav-link"
                                                id="pills-contact-tab"
                                                data-bs-toggle="pill"
                                                data-bs-target="#pills-contact"
                                                type="button"
                                                role="tab"
                                                aria-controls="pills-contact"
                                                aria-selected="false"
                                            >
                                                Specifications
                                            </button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className="nav-link"
                                                id="pills-size-tab"
                                                data-bs-toggle="pill"
                                                data-bs-target="#pills-size"
                                                type="button"
                                                role="tab"
                                                aria-controls="pills-size"
                                                aria-selected="false"
                                            >
                                                Size
                                            </button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button
                                                className="nav-link"
                                                id="pills-color-tab"
                                                data-bs-toggle="pill"
                                                data-bs-target="#pills-color"
                                                type="button"
                                                role="tab"
                                                aria-controls="pills-color"
                                                aria-selected="false"
                                            >
                                                Color
                                            </button>
                                        </li>
                                    </ul>
                                    <div className="d-flex justify-content-center mb-5">
                                        <button className="btn btn-success w-50" type='submit'>
                                            Create Product <i className="fa fa-check-circle" />{" "}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddProduct