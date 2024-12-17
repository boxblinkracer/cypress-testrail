const axios = require('axios');
const ApiError = require('./ApiError');
const FormData = require('form-data');
const fs = require('fs');

class ApiClient {
    /**
     * @param domain
     * @param username
     * @param password
     */
    constructor(domain, username, password) {
        this.username = username;
        this.password = password;
        this.baseUrl = `https://${domain}/index.php?/api/v2`;
    }

    /**
     *
     * @param slug
     * @param postData
     * @param onSuccess
     * @param onError
     * @returns {Promise<AxiosResponse<any>>}
     */
    sendData(slug, postData, onSuccess, onError) {
        return axios({
            method: 'post',
            url: this.baseUrl + slug,
            headers: {
                'Content-Type': 'application/json',
            },
            auth: {
                username: this.username,
                password: this.password,
            },
            data: JSON.stringify(postData),
        })
            .then((response) => {
                return onSuccess(response);
            })
            .catch((error) => {
                // extract our error
                const apiError = new ApiError(error);
                // notify about an error
                return onError(apiError.getStatusCode(), apiError.getStatusText(), apiError.getErrorText());
            });
    }

    /**
     *
     * @param resultId
     * @param path
     * @param onSuccess
     * @param onError
     * @returns {Promise<AxiosResponse<any>>}
     */
    sendAttachmentToResult(resultId, path, onSuccess, onError) {
        const formData = new FormData();
        formData.append('attachment', fs.createReadStream(path));

        return axios({
            method: 'post',
            url: this.baseUrl + '/add_attachment_to_result/' + resultId,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            auth: {
                username: this.username,
                password: this.password,
            },
            data: formData,
        })
            .then((response) => {
                if (onSuccess) {
                    return onSuccess(response);
                }
            })
            .catch((error) => {
                // extract our error
                const apiError = new ApiError(error);
                // notify about an error
                if (onError) {
                    return onError(apiError.getStatusCode(), apiError.getStatusText(), apiError.getErrorText());
                }
            });
    }

    /**
     *
     * @param runId
     * @param path
     * @param onSuccess
     * @param onError
     * @returns {Promise<AxiosResponse<any>>}
     */
    sendAttachmentToRun(runId, path, onSuccess, onError) {
        const formData = new FormData();
        formData.append('attachment', fs.createReadStream(path));

        return axios({
            method: 'post',
            url: this.baseUrl + '/add_attachment_to_run/' + runId,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            auth: {
                username: this.username,
                password: this.password,
            },
            data: formData,
        })
        .then((response) => {
            if (onSuccess) {
                return onSuccess(response);
            }
        })
        .catch((error) => {
            // extract our error
            const apiError = new ApiError(error);
            // notify about an error
            if (onError) {
                return onError(apiError.getStatusCode(), apiError.getStatusText(), apiError.getErrorText());
            }
        });
    }

    
    /**
     *
     * @param runId
     * @param onSuccess
     * @param onError
     * @returns {Promise<AxiosResponse<any>>}
     */
    getAttachmentsForRun(runId, onSuccess, onError) {
        return axios({
            method: 'get',
            url: this.baseUrl + '/get_attachments_for_run/' + runId,
            headers: {
                'Content-Type': 'application/json',
            },
            auth: {
                username: this.username,
                password: this.password,
            },
            data: {}
        })
        .then((response) => {
            if (onSuccess) {
                return onSuccess(response);
            }
        })
        .catch((error) => {
            // extract our error
            const apiError = new ApiError(error);
            // notify about an error
            if (onError) {
                return onError(apiError.getStatusCode(), apiError.getStatusText(), apiError.getErrorText());
            }
        });
    }

        /**
     *
     * @param attachmentId
     * @param onSuccess
     * @param onError
     * @returns {Promise<AxiosResponse<any>>}
     */
    deleteAttachment(attachmentId, onSuccess, onError) {
        return axios({
            method: 'post',
            url: this.baseUrl + '/delete_attachment/' + attachmentId,
            auth: {
                username: this.username,
                password: this.password,
            },
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then((response) => {
            if (onSuccess) {
                return onSuccess(response);
            }
        })
        .catch((error) => {
            // extract our error
            const apiError = new ApiError(error);
            // notify about an error
            if (onError) {
                return onError(apiError.getStatusCode(), apiError.getStatusText(), apiError.getErrorText());
            }
        });
    }
}

module.exports = ApiClient;
