import React from "react";
import { IconEyeClosed } from '../../assets/icons/iconEyeClosed';
import { IconEye } from '../../assets/icons/IconEye';
import TextInputWhiteBackground from "../TextInputWhiteBackground";

const SwidistincCredentialsTab = ({
    register,
    errors
}) => {
    return (
        <div className="p-4">
            <h5 className="mb-2 fw-semibold">Swidistinc Credentials</h5>

            <p className="text-muted mb-4 small">
                These credentials are used to authenticate with the
                Swidistinc platform.
            </p>

            <TextInputWhiteBackground
                name="swidistinc_ediID"
                type="text"
                placeholder="Enter username"
                label="Username"
                register={register}
                error={errors?.swidistinc_ediID}
                containerStyle={{ paddingBottom: "20px" }}
                validation={{
                    // required: "Username is required",
                    pattern: {
                        value: /^[A-Za-z0-9]+$/,
                        message: "Username can only contain letters and numbers"
                    }
                }}
            />

            <TextInputWhiteBackground
                name="swidistinc_password"
                type="password"
                placeholder="Enter password"
                label="Password"
                register={register}
                error={errors?.swidistinc_password}
                containerStyle={{ paddingBottom: "20px" }}
                icon={<IconEye />}
                changeIcon={<IconEyeClosed />}
                changeType="text"
                validation={{
                    // required: "Password is required",
                    minLength: {
                        value: 16,
                        message: "Password must be at least 16 characters"
                    },
                    maxLength: {
                        value: 20,
                        message: "Password cannot exceed 20 characters"
                    },
                    pattern: {
                        value: /^\S+$/,
                        message: "Whitespace is not allowed"
                    }
                }}
            />
        </div>
    );
};

export default SwidistincCredentialsTab;