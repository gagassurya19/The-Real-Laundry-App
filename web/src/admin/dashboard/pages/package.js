import React from "react";
import { Modal } from "../../../components";

import axios from "axios";
import Swal from "sweetalert2";

export default class Package extends React.Component {
    constructor() {
        super()
        this.state = {
            modal: "hidden",
            addAddress: true,
            modal_content: {
                modal_title: 'Tambah Transaksi',
                modal_subTitle: 'Ini subtitle',
                modal_desc: 'Syarat Penggunaan: <br /> - Wajib memasukan semua kolom'
            },
            token: localStorage.getItem('token_admin'),
            data_package: []
        }
    }

    toggleModal = (isOpen) => {
        if (isOpen) {
            this.setState({ modal: "flex" })
        } else {
            this.setState({ modal: "hidden" })
        }
    }

    addData = async () => {
        this.toggleModal(true)
        this.setState({
            action: 'add',
            name: "",
            price: 0,
            notes: "",
            status: 1,
        })
    }

    editData = async (selectedItem) => {
        this.toggleModal(true)
        this.setState({
            action: 'edit',
            id_package: selectedItem.id_package,
            name: selectedItem.name,
            price: selectedItem.price,
            notes: selectedItem.notes,
            status: selectedItem.status,
        })
    }

    saveData = (ev) => {
        ev.preventDefault()

        let data = {
            name: this.state.name,
            price: this.state.price,
            notes: this.state.notes,
            status: this.state.status,
        }

        if (this.state.action === "add") {
            const url = process.env.REACT_APP_ADMIN_API_URL + 'admin_package'
            axios.post(url, data, {
                headers: {
                    Authorization: "Bearer " + this.state.token
                }
            })
                .then(response => {
                    this.getDataPackage()
                    console.log(response);
                })
                .catch(error => console.log(error))
        } else if (this.state.action === "edit") {
            const url = process.env.REACT_APP_ADMIN_API_URL + 'admin_package/' + this.state.id_package
            axios.put(url, data, {
                headers: {
                    Authorization: "Bearer " + this.state.token
                }
            })
                .then(response => {
                    this.getDataPackage()
                })
                .catch(error => console.log(error))
        }
        this.toggleModal(false)
    }

    deleteData = (selectedItem) => {
        const url = process.env.REACT_APP_ADMIN_API_URL + 'admin_package/' + selectedItem.id_package

        const sweetAlertTailwindButton = Swal.mixin({
            customClass: {
                confirmButton: 'bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mx-3 rounded',
                cancelButton: 'bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 mx-3 rounded'
            },
            buttonsStyling: false
        })

        sweetAlertTailwindButton.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(url, {
                    headers: {
                        Authorization: "Bearer " + this.state.token
                    }
                })
                    .then(response => {
                        if (response.data.isSuccess) {
                            this.getDataPackage()
                            sweetAlertTailwindButton.fire(
                                'Deleted!',
                                'Your data has been deleted.',
                                'success'
                            )
                        } else {
                            sweetAlertTailwindButton.fire(
                                'Failed!',
                                response.data.message,
                                'error'
                            )
                        }
                    })
                    .catch(error => {
                        sweetAlertTailwindButton.fire(
                            'Error!',
                            error.message,
                            'errors'
                        )
                    })

            } else if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
            ) {
                sweetAlertTailwindButton.fire(
                    'Cancelled',
                    'Your data is safe :)',
                    'error'
                )
            }
        })
    }

    // get data package
    getDataPackage = async () => {
        const url = process.env.REACT_APP_ADMIN_API_URL + 'admin_package'

        await axios.get(url, {
            headers: {
                Authorization: "Bearer " + this.state.token
            }
        })
            .then(result => {
                this.setState({
                    data_package: result.data.data_package
                })
            })
            .catch(error => console.log(error))
    }

    async componentDidMount() {
        await this.getDataPackage()
    }

    render() {
        return (
            <>
                <div className="bg-gray-100">
                    <div className="container mx-auto py-10">
                        <div class="col-span-1 md:col-span-2 lg:col-span-4 flex justify-between py-7">
                            <div>
                                <h1 class="title-font sm:text-3xl text-2xl mb-1 font-medium text-gray-900">Package Management</h1>
                                <p class="leading-relaxed text-gray-500">Panel management paket laundry</p>
                            </div>
                            <div>
                                <button type="submit" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    onClick={(ev) => { this.addData(ev) }}>
                                    Add new data
                                </button>
                            </div>
                        </div>
                        <div className="xl:col-span-3 col-span-5">
                            <div class="flex flex-col">
                                <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                    <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                                        <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                            <table class="min-w-full divide-y divide-gray-200">
                                                <thead class="bg-gray-50">
                                                    <tr>
                                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            No
                                                        </th>
                                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            ID
                                                        </th>
                                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Nama Paket
                                                        </th>
                                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Harga
                                                        </th>
                                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Notes
                                                        </th>
                                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Status
                                                        </th>
                                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Option
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody class="bg-white divide-y divide-gray-200">
                                                    {this.state.data_package.map((data, i) => (
                                                        <tr>
                                                            <td class="px-6 py-4 whitespace-nowrap">
                                                                <div class="text-sm text-gray-900">
                                                                    {++i}
                                                                </div>
                                                            </td>
                                                            <td class="px-6 py-4 whitespace-nowrap">
                                                                <div class="text-sm text-gray-900">
                                                                    {data.id_package}
                                                                </div>
                                                            </td>
                                                            <td class="px-6 py-4 whitespace-nowrap">
                                                                <div class="text-sm text-gray-900">
                                                                    {data.name}
                                                                </div>
                                                            </td>
                                                            <td class="px-6 py-4 whitespace-nowrap">
                                                                <div class="text-sm text-gray-900">
                                                                    Rp{data.price}
                                                                </div>
                                                            </td>
                                                            <td class="px-6 py-4 whitespace-nowrap">
                                                                <div class="text-sm text-gray-900">
                                                                    <textarea readonly class="mt-1 p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" rows="1"
                                                                        value={data.notes || "Ga ada notes"}>
                                                                    </textarea>
                                                                </div>
                                                            </td>
                                                            <td class="px-6 py-4 whitespace-nowrap">
                                                                {data.status ? (
                                                                    <span class="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900">Active</span>

                                                                ) : (
                                                                    <span class="bg-red-100 text-red-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-900">Inactive</span>
                                                                )}
                                                            </td>
                                                            <td class="px-6 py-4 whitespace-nowrap">
                                                                <div className="inline-flex relative items-center gap-2">
                                                                    <button type="button" onClick={() => this.deleteData(data)}>
                                                                        <svg class="w-6 h-6 text-red-500 hover:text-red-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                                                                    </button>
                                                                    <button type="button" onClick={() => this.editData(data)}>
                                                                        <svg class="w-6 h-6 text-indigo-500 hover:text-indigo-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path><path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd"></path></svg>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* modal */}
                <Modal modal={this.state.modal}>
                    {/* notes */}
                    <div>
                        <h3 class="text-lg font-medium leading-6 text-gray-900">{this.state.modal_content.modal_title}</h3>
                        <p class="mb-8 leading-relaxed text-gray-500">{this.state.modal_content.modal_subTitle}</p>
                        <p class="mt-1 text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: this.state.modal_content.modal_desc }}></p>

                    </div>
                    {/* Form */}
                    <div>
                        <form onSubmit={(ev) => this.saveData(ev)} >
                            <div class="px-4 py-5 bg-white sm:p-6">

                                <div class="px-4 py-5 sm:p-6">
                                    <div class="grid grid-cols-6 gap-6">

                                        <div class="col-span-6 sm:col-span-6">
                                            <label for="nama_paket" class="block text-sm font-medium text-gray-700">Nama Paket</label>
                                            <input type="text" name="nama_paket" id="nama_paket" autocomplete="nama_paket"
                                                class="mt-1 p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                value={this.state.name}
                                                onChange={ev => this.setState({ name: ev.target.value })}
                                                placeholder='Nama Paket'
                                                required />
                                        </div>

                                        <div class="col-span-6 sm:col-span-3">
                                            <label for="harga" class="block text-sm font-medium text-gray-700">Harga</label>
                                            <input type="text" name="harga" id="harga" autocomplete="harga"
                                                class="mt-1 p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                value={this.state.price}
                                                onChange={ev => this.setState({ price: ev.target.value })}
                                                placeholder='Rp1000'
                                                required />
                                        </div>

                                        <div class="col-span-6 sm:col-span-3">
                                            <label for="first-name" class="block text-sm font-medium text-gray-700">Status</label>
                                            <select required class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                                value={this.state.status} onChange={ev => this.setState({ status: ev.target.value })}>
                                                <optgroup label="Select Status:">
                                                    <option value="1">Active</option>
                                                    <option value="0">Inactive</option>
                                                </optgroup>
                                            </select>
                                        </div>

                                        <div className="col-span-6">
                                            <p class="leading-relaxed text-gray-500">Notes (Optional)</p>
                                            <textarea
                                                class="mt-1 p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                id="exampleFormControlTextarea1"
                                                rows="3"
                                                value={this.state.notes}
                                                onChange={ev => this.setState({ notes: ev.target.value })}
                                                placeholder="Write your notes here...">
                                            </textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
                                <>
                                    <button
                                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => this.toggleModal(false)}>
                                        Close
                                    </button>
                                    <button
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                        type="submit">
                                        Save
                                    </button>
                                </>
                            </div>
                        </form>
                    </div>
                </Modal >
            </>
        )
    }
}