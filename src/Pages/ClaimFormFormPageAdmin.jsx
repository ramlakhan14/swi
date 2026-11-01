import React, { useEffect, useRef, useState } from "react";
import HelmetComponent from "../components/HelmetComponent";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import TextInputWhiteBackground from "../components/TextInputWhiteBackground";
import SelectInput from "../components/SelectInput";
import AddIcon from "../assets/icons/ic-add.png";
import { showErrorToast, showSuccessToast } from "../utils/ToastUtils";
import { useUser } from "../context/UserContext";
import Loader from "../components/Loader";
import trashIcon from "../assets/icons/ic-trash-black.png";
import FileInputWhiteBackground from "../components/FileInputWhiteBackground";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import BackIcon from "../assets/icons/ic-back.png";
import { useNavigate } from "react-router-dom";
import {
  getDealerUser,
  getRebateTypeAdmin,
} from "../services/rebateFormApiForUser";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import {
  getProductSerialClaimsAdmin,
  getSerialNumberVerificationAdmin,
  createClaimFormAdmin,
  getModelAdmin,
} from "../services/claimFormAdmin";
import { downloadAdminClaimFormCode } from "../utils/downloadAdminClaimFormCode";
import { downloadDealerClaimFormCode } from "../utils/downloadDealerClaimFormCode";

const ClaimFormFormPageAdmin = () => {
  const fileInputRef = useRef(null);
  const { user } = useUser();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
    setError,
    control,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      rows: [],
    },
  });
  const [dateOfSale, setDateOfSale] = useState(null);
  const navigate = useNavigate();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "rows",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [manufacturers, setManufacturers] = useState([]);
  const [modalsData, setModalsData] = useState([]);
  const [serialNumberData, setSerialNumberData] = useState({});
  const [modelSerialValues, setModelSerialValues] = useState({});
  const [partNumber, setPartNumber] = useState({});
  const [points, setPoints] = useState({});
  const [msrp, setMsrp] = useState({});
  const [discountDollar, setDiscountDollar] = useState({});
  const [discountPercentage, setDiscountPercentage] = useState({});
  const [dealerRebate, setDealerRebate] = useState({});
  const [dealerActualCost, setDealerActualCost] = useState({});
  const [discountRate, setDiscountRate] = useState({});
  const [sellPrice, setSellPrice] = useState({});

  const rebateValues = watch("type");
  const manufacturerId = watch("manufacturer_select");
  const userDealerId = watch("dealer_id");
  const dealerCustomerName = watch("dealer_customer_name");
  const selectedManufacturer = manufacturers.find(
    (m) => m.value == manufacturerId,
  );
  const manufacturerLabel = selectedManufacturer?.label?.toLowerCase() || "";
  const isLittleWonder =
    manufacturerLabel === "little wonder" ||
    manufacturerLabel === "classen" ||
    manufacturerLabel === "mantis";

  useEffect(() => {
    if (dealerCustomerName !== undefined) {
      fields.forEach((_, i) =>
        setValue(`rows.${i}.dealer_custom`, dealerCustomerName),
      );
    }
  }, [dealerCustomerName]);

  const getTotalMsrp = () => {
    return Object.values(dealerRebate).reduce((sum, value) => {
      const num = parseFloat(value);
      return sum + (isNaN(num) ? 0 : num);
    }, 0);
  };

  const rebateField = {
    name: "type",
    label: "Type of Claim",
    required: true,
    options: [
      { value: "bid", label: "Bid" },
      { value: "fleet", label: "Fleet" },
    ],
  };

  const manufacturerField = {
    name: "manufacturer_select",
    label: "Manufacturer",
    required: true,
    options: manufacturers,
  };

  useEffect(() => {
    const fetchManufacturers = async (rebateValues) => {
      try {
        const response = await getRebateTypeAdmin(rebateValues);
        const manufacturerOptions =
          response?.data?.products
            ?.filter((item) => item?.product_name?.toLowerCase() === "redmax")
            ?.map((item) => ({
              value: item?.id,
              label: item?.product_name,
            })) || [];

        setManufacturers(manufacturerOptions);
        showSuccessToast(response?.message);
      } catch (error) {
        showErrorToast(error?.response?.data?.message);
      }
    };
    if (rebateValues) {
      fetchManufacturers(rebateValues);
    }
  }, [rebateValues]);

  const fetchDealerName = async () => {
    try {
      const response = await getDealerUser({ dealer_id: userDealerId });
      setValue("dealer_name", response?.data?.company_name || "");
    } catch (error) {
      // showErrorToast(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (userDealerId) {
        fetchDealerName();
      }
    }, 1000); // debounce time in ms

    return () => clearTimeout(timer);
  }, [userDealerId]);

  useEffect(() => {
    const fetchModels = async (id) => {
      try {
        if (userDealerId === "") {
          setError("dealer_id", {
            type: "manual",
            message: "Dealer ID is required",
          });
          return;
        }
        const response = await getModelAdmin(id, userDealerId);
        const models =
          response?.data?.models.map((item) => ({
            value: item?.model_number,
            label: item?.model_number,
          })) || [];
        setModalsData(models);
        showSuccessToast(response?.message);
        if (fields.length === 0) {
          append({
            model_no: "",
            serial_no: "",
            dealer_custom: "",
            date_unit_sold: "",
            sell_price: "",
          });
        }
      } catch (error) {
        showErrorToast(error?.response?.data?.message);
      }
    };
    if (manufacturerId) {
      fetchModels(manufacturerId, userDealerId);
    } else {
      while (fields.length > 0) {
        remove(0);
      }
      setModalsData([]);
    }
  }, [manufacturerId]);

  const fetchUserData = async () => {
    setValue("manufacturer_select", "");
  };
  useEffect(() => {
    fetchUserData();
  }, [userDealerId]);

  const addNewRow = () => {
    const currentDealerName = watch("dealer_customer_name") || "";
    append({
      model_no: "",
      serial_no: "",
      dealer_custom: currentDealerName,
      date_unit_sold: dateOfSale ? new Date(dateOfSale) : "",
      sell_price: "",
    });
  };

  const removeRow = (index) => {
    remove(index);

    const reIndex = (stateObj) => {
      const updated = {};
      Object.keys(stateObj).forEach((key) => {
        const k = parseInt(key);
        if (k < index) {
          updated[k] = stateObj[k];
        } else if (k > index) {
          updated[k - 1] = stateObj[k];
        }
      });
      return updated;
    };

    setDiscountDollar((prev) => reIndex(prev));
    setDiscountPercentage((prev) => reIndex(prev));
    setDealerRebate((prev) => reIndex(prev));
    setMsrp((prev) => reIndex(prev));
    setPoints((prev) => reIndex(prev));
    setPartNumber((prev) => reIndex(prev));
    setModelSerialValues((prev) => reIndex(prev));
    setSerialNumberData((prev) => reIndex(prev));
    setDiscountRate((prev) => reIndex(prev));
    setSellPrice((prev) => reIndex(prev));
  };

  const getAvailableModels = (currentRowIndex) => {
    return modalsData;
  };

  const getAvailableSerialNumbers = (currentRowIndex) => {
    const currentVal = watch(`rows.${currentRowIndex}.serial_no`);
    const rowSerials = serialNumberData[currentRowIndex] || [];
    const selectedSerials = fields
      .map((field, idx) => {
        if (idx !== currentRowIndex) return watch(`rows.${idx}.serial_no`);
        return null;
      })
      .filter(Boolean);

    const filtered = rowSerials.filter(
      (serial) => !selectedSerials.includes(serial.value),
    );

    const alreadyInList = filtered.some((item) => item.value === currentVal);
    if (currentVal && !alreadyInList) {
      filtered.unshift({ value: currentVal, label: currentVal });
    }

    return filtered;
  };

  const fetchSerialNumbers = async (modelId, index) => {
    try {
      setIsLoading(true);
      const previouslySelected = watch(`rows.${index}.serial_no`);
      const response = await getProductSerialClaimsAdmin(modelId, userDealerId);
      const serialOptions =
        response?.data?.serials?.map((item) => ({
          value: item?.serial_number,
          label: item?.serial_number,
        })) || [];

      setSerialNumberData((prev) => ({ ...prev, [index]: serialOptions }));

      if (previouslySelected) {
        setValue(`rows.${index}.serial_no`, previouslySelected);
      }
      showSuccessToast(response?.message);
    } catch (error) {
      showErrorToast(error?.response?.data?.message);
      setSerialNumberData((prev) => ({ ...prev, [index]: [] }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimers = {};

    const subscription = watch((value, { name }) => {
      if (name?.startsWith("rows.") && name.includes("model_no")) {
        const match = name.match(/rows\.(\d+)\./);
        if (match) {
          const index = parseInt(match[1]);
          if (name === `rows.${index}.model_no`) {
            setValue(`rows.${index}.serial_no`, "");
            const modelNo = watch(`rows.${index}.model_no`);
            if (modelNo) {
              fetchSerialNumbers(modelNo, index);
            } else {
              setSerialNumberData((prev) => ({ ...prev, [index]: [] }));
            }
          }
        }
      }

      if (
        name?.startsWith("rows.") &&
        (name.includes("model_no") || name.includes("serial_no"))
      ) {
        const match = name.match(/rows\.(\d+)\./);
        if (match) {
          const index = parseInt(match[1]);
          if (debounceTimers[index]) {
            clearTimeout(debounceTimers[index]);
          }
          debounceTimers[index] = setTimeout(() => {
            updateModelSerial(index);
          }, 500);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, modalsData]);

  // Recompute sell price whenever msrp or discountRate changes
  useEffect(() => {
    fields.forEach((_, index) => {
      computeSellPrice(index);
    });
  }, [msrp, discountRate]);

  const handleDiscountRateChange = (index, value) => {
    setDiscountRate((prev) => ({ ...prev, [index]: value }));
  };

  const computeSellPrice = (index) => {
    const msrpValue = parseFloat(msrp[index]);
    const rateValue = parseFloat(discountRate[index]);

    if (!isNaN(msrpValue) && !isNaN(rateValue)) {
      const computed = msrpValue - rateValue;
      setSellPrice((prev) => ({ ...prev, [index]: computed.toFixed(2) }));
      calculatePrice(index, computed);
    } else {
      setSellPrice((prev) => ({ ...prev, [index]: "-" }));
      setDiscountDollar((prev) => ({ ...prev, [index]: "-" }));
      setDiscountPercentage((prev) => ({ ...prev, [index]: "-" }));
      setDealerRebate((prev) => ({ ...prev, [index]: "-" }));
    }
  };

  const updateModelSerial = async (index) => {
    const modelNo = watch(`rows.${index}.model_no`);
    const serialNo = watch(`rows.${index}.serial_no`);

    if (modelNo && serialNo) {
      const selectedModel = modalsData.find((model) => model.value === modelNo);
      const modelLabel = selectedModel ? selectedModel.label : modelNo;

      try {
        setIsLoading(true);
        const response = await getSerialNumberVerificationAdmin({
          model_number: modelLabel,
          serial_number: serialNo,
          dealer_id: userDealerId,
        });
        showSuccessToast(response?.message);
        setModelSerialValues((prev) => ({
          ...prev,
          [index]: `${response?.data?.model_serial_combination}`,
        }));
        setPartNumber((prev) => ({
          ...prev,
          [index]: response?.data?.part_number || "-",
        }));
        setPoints((prev) => ({
          ...prev,
          [index]:
            response?.data?.points === 0 ? "0" : response?.data?.points || "-",
        }));
        setMsrp((prev) => ({
          ...prev,
          [index]: response?.data?.msrp || "-",
        }));
      } catch (error) {
        showErrorToast(error?.response?.data?.message);
        setModelSerialValues((prev) => ({ ...prev, [index]: "-" }));
        setPartNumber((prev) => ({ ...prev, [index]: "-" }));
        setPoints((prev) => ({ ...prev, [index]: "-" }));
        setMsrp((prev) => ({ ...prev, [index]: "-" }));
        setDiscountDollar((prev) => ({ ...prev, [index]: "-" }));
        setDiscountPercentage((prev) => ({ ...prev, [index]: "-" }));
        setDealerRebate((prev) => ({ ...prev, [index]: "-" }));
        setSellPrice((prev) => ({ ...prev, [index]: "-" }));
      } finally {
        setIsLoading(false);
      }
    } else {
      setModelSerialValues((prev) => ({ ...prev, [index]: "-" }));
      setPartNumber((prev) => ({ ...prev, [index]: "-" }));
      setPoints((prev) => ({ ...prev, [index]: "-" }));
      setMsrp((prev) => ({ ...prev, [index]: "-" }));
      setDiscountDollar((prev) => ({ ...prev, [index]: "-" }));
      setDiscountPercentage((prev) => ({ ...prev, [index]: "-" }));
      setDealerRebate((prev) => ({ ...prev, [index]: "-" }));
      setSellPrice((prev) => ({ ...prev, [index]: "-" }));
    }
  };

  const calculatePrice = async (index, computedSellPrice) => {
    const sellPriceInput =
      computedSellPrice !== undefined
        ? computedSellPrice
        : parseFloat(sellPrice[index]);

    const isLittleWonderCalc =
      manufacturerLabel === "little wonder" ||
      manufacturerLabel === "classen" ||
      manufacturerLabel === "mantis";

    if (sellPriceInput && !isNaN(sellPriceInput)) {
      const msrpValue = parseFloat(msrp[index]);
      const sellPriceValue = parseFloat(sellPriceInput);

      if (isNaN(msrpValue) || isNaN(sellPriceValue)) {
        setDiscountDollar((prev) => ({ ...prev, [index]: "-" }));
        setDiscountPercentage((prev) => ({ ...prev, [index]: "-" }));
        setDealerRebate((prev) => ({ ...prev, [index]: "-" }));
        return;
      }
      if (msrpValue === 0) {
        setDiscountDollar((prev) => ({ ...prev, [index]: "-" }));
        setDiscountPercentage((prev) => ({ ...prev, [index]: "-" }));
        setDealerRebate((prev) => ({ ...prev, [index]: "-" }));
        return;
      }

      const discountDollarVal = msrpValue - sellPriceValue;
      const discountPercentageVal = (
        (1 - sellPriceValue / msrpValue) *
        100
      ).toFixed(2);
      const discountPercentageNum = parseFloat(discountPercentageVal);

      let dealerRebateVal = 0;

      if (isLittleWonderCalc) {
        if (discountPercentageNum < 10) {
          dealerRebateVal = 0;
        } else if (discountPercentageNum >= 10 && discountPercentageNum < 15) {
          dealerRebateVal = discountPercentageNum * 7;
        } else if (discountPercentageNum >= 15 && discountPercentageNum < 20) {
          dealerRebateVal = discountPercentageNum * 8.5;
        } else if (discountPercentageNum >= 20) {
          dealerRebateVal = discountPercentageNum * 10;
        }
      } else {
        if (discountPercentageNum >= 10 && discountPercentageNum < 20) {
          dealerRebateVal = discountDollarVal / 2;
        } else if (discountPercentageNum >= 20) {
          dealerRebateVal = msrpValue * 0.1;
        } else {
          dealerRebateVal = discountDollarVal;
        }
      }

      setDiscountDollar((prev) => ({
        ...prev,
        [index]: !isNaN(discountDollarVal) ? discountDollarVal.toFixed(2) : "-",
      }));
      setDiscountPercentage((prev) => ({
        ...prev,
        [index]: !isNaN(discountPercentageNum) ? discountPercentageVal : "-",
      }));
      setDealerRebate((prev) => ({
        ...prev,
        [index]: !isNaN(dealerRebateVal) ? dealerRebateVal.toFixed(2) : "-",
      }));
    } else {
      setDiscountDollar((prev) => ({ ...prev, [index]: "-" }));
      setDiscountPercentage((prev) => ({ ...prev, [index]: "-" }));
      setDealerRebate((prev) => ({ ...prev, [index]: "-" }));
    }
  };

  const onSubmit = async (data) => {
    const formattedData = {
      type: data.type,
      manufacturer_select: data.manufacturer_select,
      dealer_name: data.dealer_name,
      dealer_id: data.dealer_id,
      dealer_signature: data.dealer_signature,
      dealer_customer_name: data.dealer_customer_name,
      invoice_number: data.invoice_number,
      date_of_sale: dateOfSale
        ? new Date(
            dateOfSale.getTime() - dateOfSale.getTimezoneOffset() * 60000,
          )
            .toISOString()
            .split("T")[0]
        : "",
      invoice_file: data.invoice_file,
      claim_rows:
        data.rows?.map((row, index) => ({
          qty: 1,
          model_number: row.model_no || "",
          serial_number: row.serial_no || "",
          model_serial: modelSerialValues[index] || "",
          part_number: partNumber[index] || "",
          dealer_custom: row.dealer_custom || "",
          points: points[index] ? parseFloat(points[index]) : 0,
          msrp: msrp[index] ? parseFloat(msrp[index]) : 0,
          discount_rate: discountRate[index]
            ? parseFloat(discountRate[index])
            : 0,
          sell_price_bid_price:
            sellPrice[index] && sellPrice[index] !== "-"
              ? parseFloat(sellPrice[index])
              : 0,
          date_unit_sold: data.rows?.[index]?.date_unit_sold
            ? new Date(
                data.rows[index].date_unit_sold.getTime() -
                  data.rows[index].date_unit_sold.getTimezoneOffset() * 60000,
              )
                .toISOString()
                .split("T")[0]
            : "",
          discount_of_dollar:
            discountDollar[index] && discountDollar[index] !== "-"
              ? parseFloat(discountDollar[index])
              : 0,
          discount_of_percentage:
            discountPercentage[index] && discountPercentage[index] !== "-"
              ? parseFloat(discountPercentage[index])
              : 0,
          ...(isLittleWonder && {
            dealer_actual_cost: row.dealer_actual_cost
              ? parseFloat(row.dealer_actual_cost)
              : 0,
          }),
          dealer_rebate_dollar:
            dealerRebate[index] && dealerRebate[index] !== "-"
              ? parseFloat(dealerRebate[index])
              : 0,
        })) || [],
      total: getTotalMsrp(),
    };

    const formData = new FormData();
    Object.keys(formattedData).forEach((key) => {
      const value = formattedData[key];
      if (value instanceof FileList && value.length > 0) {
        formData.append(key, value[0]);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          Object.keys(item).forEach((subKey) => {
            formData.append(`${key}[${index}][${subKey}]`, item[subKey]);
          });
        });
      } else if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    try {
      const response = await createClaimFormAdmin(formData);
      showSuccessToast(response?.message);
      reset({
        type: "",
        acknowledgement: false,
        manufacturer_select: "",
        dealer_name: "",
        dealer_signature: "",
        dealer_customer_name: "",
        dealer_id: "",
        date_of_sale: "",
        invoice_number: "",
        invoice_file: null,
        rows: [],
      });
      fileInputRef.current?.resetFileName();
      setModelSerialValues({});
      setPartNumber({});
      setPoints({});
      setMsrp({});
      setDiscountRate({});
      setSellPrice({});
      setDiscountDollar({});
      setDiscountPercentage({});
      setDealerRebate({});
      setDealerActualCost({});
      setDateOfSale(null);
    } catch (error) {
      if (error?.response?.data.responseCode === 422) {
        return showErrorToast(
          Object.values(error?.response?.data?.messages)[0][0] ||
            "Failed to rebate form",
        );
      } else {
        showErrorToast(error?.response?.data?.message);
      }
    }
  };

  return (
    <>
      <HelmetComponent
        title="Claim Form | SWI"
        description="This is the description for the claim form page."
        keywords="react, helmet, seo"
        canonicalUrl=""
        customMeta={[
          { name: "robots", content: "index, follow" },
          { name: "author", content: "Ritik Jain" },
          { property: "og:title", content: "My React App" },
        ]}
      />
      {isLoading && <Loader />}
      <div className="container-fluid">
        <div className="container">
          <div className="row">
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              onKeyDown={(e) => {
                if (
                  e.key === " " &&
                  e.target.tagName !== "INPUT" &&
                  e.target.tagName !== "TEXTAREA"
                )
                  e.preventDefault();
              }}
            >
              <div
                className="col-12 homepage-left-div common-page-div"
                style={{ borderRadius: "12px" }}
              >
                <div className="name-part">
                  <div className="d-flex justify-content-between align-items-center">
                    <h2>Claim Form</h2>
                    <div className="d-flex align-items-center" style={{ gap: "8px" }}>
                      <button
                        type="button"
                        className="btn btn-dark black-btn"
                        style={{ padding: "10px" }}
                        onClick={() => navigate("/")}
                      >
                        <img
                          src={BackIcon}
                          alt="Back Icon"
                          width={"24px"}
                          height={"24px"}
                          loading="lazy"
                        />
                      </button>
                      <button
                        type="button"
                        className="btn btn-dark black-btn"
                        style={{
                          padding: "12px 16px",
                          fontSize: "12px",
                          fontWeight: "700",
                        }}
                        onClick={() => {
                          try {
                            downloadDealerClaimFormCode();
                            showSuccessToast(
                              "Dealer claim form code downloaded successfully.",
                            );
                          } catch (error) {
                            showErrorToast(
                              "Failed to download dealer claim form code.",
                            );
                          }
                        }}
                      >
                        Dealer Claim Form Code
                      </button>
                      <button
                        type="button"
                        className="btn btn-dark black-btn"
                        style={{
                          padding: "12px 16px",
                          fontSize: "12px",
                          fontWeight: "700",
                        }}
                        onClick={() => {
                          try {
                            downloadAdminClaimFormCode();
                            showSuccessToast(
                              "Admin claim form code downloaded successfully.",
                            );
                          } catch (error) {
                            showErrorToast(
                              "Failed to download admin claim form code.",
                            );
                          }
                        }}
                      >
                        Admin Claim Form Code
                      </button>
                      <button
                        type="submit"
                        className="btn btn-success green-btn swi-edi-login-btn"
                        style={{ padding: "12px 24px" }}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Submitting...
                          </>
                        ) : (
                          "Submit "
                        )}
                      </button>
                    </div>
                  </div>
                  <hr
                    style={{
                      borderColor: "#E4E4E7",
                      margin: "20px 0",
                      opacity: "1",
                    }}
                  />
                </div>

                <div className="row align-items-start">
                  <div className="col-12 col-md-4">
                    <TextInputWhiteBackground
                      name="dealer_id"
                      type="text"
                      placeholder="Enter your SWI dealer ID number here"
                      label="SWI Dealer ID Number"
                      register={register}
                      error={errors.dealer_id}
                      validation={{
                        required: "SWI Dealer ID Number is required",
                        minLength: {
                          value: 3,
                          message:
                            "SWI Dealer ID Number must be at least 3 characters long",
                        },
                      }}
                      containerStyle={{ paddingBottom: "20px" }}
                    />
                  </div>
                  <div className="col-12 col-md-4">
                    <SelectInput
                      field={rebateField}
                      register={register}
                      error={errors.type}
                      className="form-select-input"
                      containerStyle={{ marginBottom: "20px" }}
                    />
                  </div>
                  <div className="col-12 col-md-4">
                    <SelectInput
                      field={manufacturerField}
                      register={register}
                      error={errors.manufacturer_select}
                      className="form-select-input"
                      containerStyle={{ marginBottom: "20px" }}
                    />
                  </div>
                </div>

                <div className="row align-items-start">
                  <div className="col-12 col-md-4">
                    <TextInputWhiteBackground
                      name="dealer_name"
                      type="text"
                      placeholder="Enter your dealer name here"
                      label="Dealer Name"
                      register={register}
                      error={errors.dealer_name}
                      validation={{
                        required: "Dealer Name is required",
                        minLength: {
                          value: 2,
                          message:
                            "Dealer Name must be at least 2 characters long",
                        },
                      }}
                      containerStyle={{ paddingBottom: "20px" }}
                    />
                  </div>
                  <div className="col-12 col-md-4">
                    <TextInputWhiteBackground
                      name="dealer_signature"
                      type="text"
                      placeholder="Enter your dealer signature here"
                      label="Dealer Signature"
                      register={register}
                      error={errors.dealer_signature}
                      validation={{
                        required: "Dealer Signature is required",
                        minLength: {
                          value: 2,
                          message:
                            "Dealer Signature must be at least 2 characters long",
                        },
                      }}
                      containerStyle={{ paddingBottom: "5px" }}
                    />
                    <div
                      className="form-check"
                      style={{ paddingBottom: "20px" }}
                    >
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`product_ids`}
                        {...register("acknowledgement")}
                      />
                      <label
                        className="form-check-label modal-para-text ms-1 mb-0"
                        htmlFor="product_ids"
                        style={{ fontSize: "14px", color: "#666" }}
                      >
                        By checking this box I acknowledge the name supplied in
                        the signature field represents my digital signature
                      </label>
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <TextInputWhiteBackground
                      name="dealer_customer_name"
                      type="text"
                      placeholder="Enter your dealer customer here"
                      label="Dealer Customer"
                      register={register}
                      error={errors.dealer_customer_name}
                      validation={{
                        minLength: {
                          value: 2,
                          message:
                            "Dealer Customer must be at least 2 characters long",
                        },
                      }}
                      containerStyle={{ paddingBottom: "20px" }}
                    />
                  </div>
                </div>

                <div className="row align-items-start">
                  <div className="col-12 col-md-4">
                    <div className="form-group">
                      <label htmlFor="dateOfSale" className="form-label me-3">
                        Date of Sale:
                      </label>
                      <Controller
                        name="dateOfSale"
                        control={control}
                        rules={{ required: "Date of Sale is required" }}
                        render={({ field }) => (
                          <DatePicker
                            {...field}
                            selected={field.value}
                            onChange={(date) => {
                              field.onChange(date);
                              setDateOfSale(date);
                              fields.forEach((_, i) =>
                                setValue(
                                  `rows.${i}.date_unit_sold`,
                                  date ? new Date(date) : null,
                                ),
                              );
                            }}
                            dateFormat="MM-dd-yyyy"
                            placeholderText="mm-dd-yyyy"
                            className={`form-control ${errors.dateOfSale ? "is-invalid" : ""}`}
                            showIcon
                          />
                        )}
                      />
                      {errors.dateOfSale && (
                        <div className="invalid-feedback d-block pt-1">
                          {errors.dateOfSale.message}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <TextInputWhiteBackground
                      name="invoice_number"
                      type="text"
                      placeholder="Enter your invoice number here"
                      label="Invoice Number"
                      register={register}
                      error={errors.invoice_number}
                      validation={{
                        required: "Invoice Number is required",
                        minLength: {
                          value: 3,
                          message:
                            "Invoice Number must be at least 3 characters long",
                        },
                      }}
                      containerStyle={{ paddingBottom: "20px" }}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    <div className="d-flex align-items-center mb-3">
                      <p
                        className="modal-headding-text mb-0"
                        style={{ minWidth: "180px", fontWeight: "500" }}
                      >
                        Upload Invoice:
                      </p>
                      <FileInputWhiteBackground
                        name="invoice_file"
                        ref={fileInputRef}
                        label="Upload Invoice"
                        register={register}
                        error={errors.invoice_file}
                        validation={{
                          required: "Please select a file",
                          validate: {
                            fileSize: (files) =>
                              !files[0] ||
                              files[0].size <= 100 * 1024 * 1024 ||
                              "File size must be less than 100MB",
                            fileType: (files) =>
                              !files[0] ||
                              [
                                "application/pdf",
                                "text/csv",
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                "application/vnd.ms-excel",
                                "application/msword",
                                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                              ].includes(files[0].type) ||
                              "Only PDF, CSV, Excel, or Word files are allowed",
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="d-flex text-center justify-content-center">
                  {fields?.length > 1 && (
                    <p
                      className="mb-0"
                      style={{ color: "red", fontSize: "14px" }}
                    >
                      Serial number missing? This means the serial number has
                      already been used
                    </p>
                  )}
                </div>

                <div
                  className="table-responsive table-rebate overflow-auto mt-2"
                  style={{
                    maxHeight: "340px",
                    minHeight: "340px",
                    border: "1px solid #E4E4E7",
                    borderRadius: "12px",
                  }}
                >
                  <table className="w-100 mt-0 border-0">
                    <thead
                      style={{
                        backgroundColor: "#F4F4F5",
                        position: "sticky",
                        top: 0,
                        zIndex: 2,
                      }}
                    >
                      <tr className="rebate-table">
                        <th
                          scope="col"
                          style={{ padding: "8px 16px", minWidth: "72px" }}
                        >
                          QTY
                        </th>
                        <th scope="col" style={{ minWidth: "154px" }}>
                          Model
                        </th>
                        <th scope="col" style={{ minWidth: "200px" }}>
                          Serial No.
                        </th>
                        <th scope="col" style={{ minWidth: "154px" }}>
                          Model-Serial-Dealer
                        </th>
                        <th scope="col" style={{ minWidth: "79px" }}>
                          Part No.
                        </th>
                        <th scope="col" style={{ minWidth: "119px" }}>
                          Dealer Customer Name
                        </th>
                        <th scope="col" style={{ minWidth: "111px" }}>
                          Date Unit Sold
                        </th>
                        <th scope="col" style={{ minWidth: "112px" }}>
                          Points
                        </th>
                        <th scope="col" style={{ minWidth: "70px" }}>
                          MSRP
                        </th>
                        {/* <th scope="col" style={{ minWidth: "150px" }}>Discount Rate</th> */}
                        <th scope="col" style={{ minWidth: "154px" }}>
                          Sell Price/Bid Price
                        </th>
                        {isLittleWonder && (
                          <th scope="col" style={{ minWidth: "154px" }}>
                            Dealer Actual Cost
                          </th>
                        )}
                        <th scope="col" style={{ minWidth: "140px" }}>
                          Discount $
                        </th>
                        <th scope="col" style={{ minWidth: "140px" }}>
                          Discount %
                        </th>
                        <th scope="col" style={{ minWidth: "140px" }}>
                          Dealer Rebate $
                        </th>
                        <th scope="col" style={{ minWidth: "80px" }}>
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {fields.map((field, index) => {
                        const availableModels = getAvailableModels(index);
                        const availableSerialNumbers =
                          getAvailableSerialNumbers(index);
                        return (
                          <React.Fragment key={field.id}>
                            <tr
                              className="rebate-table"
                              style={{ borderTop: "1px solid #E4E4E7" }}
                            >
                              <td style={{ padding: "12px 16px" }}>1</td>

                              {/* Model */}
                              <td>
                                <select
                                  className="form-select rebate-drop-down p-0 m-0 border-0"
                                  {...register(`rows.${index}.model_no`)}
                                >
                                  <option value="">Select Model</option>
                                  {availableModels.map((item, idx) => (
                                    <option key={idx} value={item.value}>
                                      {item.label}
                                    </option>
                                  ))}
                                </select>
                              </td>

                              {/* Serial No. */}
                              <td className="p-0">
                                <Controller
                                  control={control}
                                  name={`rows.${index}.serial_no`}
                                  render={({ field }) => (
                                    <Select
                                      placeholder="Search Serial No"
                                      options={availableSerialNumbers}
                                      value={
                                        field.value
                                          ? {
                                              value: field.value,
                                              label: field.value,
                                            }
                                          : null
                                      }
                                      onChange={(selected) =>
                                        field.onChange(selected?.value || "")
                                      }
                                      classNamePrefix="react-select"
                                      noOptionsMessage={() =>
                                        "No serial no. found"
                                      }
                                      className="rebate-drop-down border-0 p-0 m-0"
                                      styles={{
                                        control: (base) => ({
                                          ...base,
                                          border: "none",
                                          boxShadow: "none",
                                          background: "transparent",
                                          minHeight: "unset",
                                        }),
                                        indicatorSeparator: () => ({
                                          display: "none",
                                        }),
                                      }}
                                    />
                                  )}
                                />
                              </td>

                              {/* Model-Serial-Dealer */}
                              <td>{modelSerialValues[index] || "-"}</td>

                              {/* Part No. */}
                              <td>
                                <input
                                  type="text"
                                  className="rebate-input-field border-0 p-0 m-0 outline-0"
                                  value={partNumber[index] || "-"}
                                  readOnly
                                  style={{ backgroundColor: "transparent" }}
                                />
                              </td>

                              {/* Dealer Customer Name */}
                              <td>
                                <input
                                  type="text"
                                  className={`rebate-input-field border-0 p-0 m-0 outline-0 ${errors?.rows?.[index]?.dealer_custom ? "is-invalid" : ""}`}
                                  {...register(`rows.${index}.dealer_custom`, {
                                    required: "Dealer Custom is required",
                                  })}
                                />
                              </td>

                              {/* Date Unit Sold */}
                              <td>
                                <Controller
                                  control={control}
                                  name={`rows.${index}.date_unit_sold`}
                                  rules={{
                                    required: "Date Unit Sold is required",
                                  }}
                                  render={({ field }) => (
                                    <DatePicker
                                      id="dateOfSale"
                                      selected={
                                        field.value
                                          ? new Date(field.value)
                                          : null
                                      }
                                      onChange={(date) => field.onChange(date)}
                                      dateFormat="MM-dd-yyyy"
                                      placeholderText="mm-dd-yyyy"
                                      className={`rebate-input-field date-picker-td border-0 p-0 m-0 outline-0 form-control ${errors?.rows?.[index]?.date_unit_sold ? "is-invalid" : ""}`}
                                    />
                                  )}
                                />
                              </td>

                              {/* Points */}
                              <td>
                                <input
                                  type="text"
                                  className="rebate-input-field border-0 p-0 m-0 outline-0"
                                  value={points[index] || "-"}
                                  readOnly
                                  style={{ backgroundColor: "transparent" }}
                                />
                              </td>

                              {/* MSRP */}
                              <td>
                                <input
                                  type="text"
                                  className="rebate-input-field border-0 p-0 m-0 outline-0"
                                  value={msrp[index] || "-"}
                                  readOnly
                                  style={{ backgroundColor: "transparent" }}
                                />
                              </td>

                              {/* Sell Price — auto-calculated, read-only */}
                              <td>
                                <input
                                  type="text"
                                  className="rebate-input-field border-0 p-0 m-0 outline-0"
                                  value={sellPrice[index] || "-"}
                                  readOnly
                                  style={{ backgroundColor: "transparent" }}
                                />
                              </td>

                              {/* Dealer Actual Cost (Little Wonder only) */}
                              {isLittleWonder && (
                                <td>
                                  <input
                                    type="text"
                                    className={`rebate-input-field border-0 p-0 m-0 outline-0 ${errors?.rows?.[index]?.dealer_actual_cost ? "is-invalid" : ""}`}
                                    {...register(
                                      `rows.${index}.dealer_actual_cost`,
                                    )}
                                  />
                                </td>
                              )}

                              {/* Discount $ */}
                              {/* Discount Rate */}
                              <td className="p-0">
                                <Controller
                                  control={control}
                                  name={`rows.${index}.discount_rate`}
                                  render={({ field }) => (
                                    <CreatableSelect
                                      placeholder="Select or type $"
                                      options={[
                                        { value: "50", label: "50$" },
                                        { value: "100", label: "100$" },
                                        { value: "150", label: "150$" },
                                        { value: "200", label: "200$" },
                                        { value: "250", label: "250$" },
                                        { value: "300", label: "300$" },
                                      ]}
                                      value={
                                        field.value
                                          ? {
                                              value: field.value,
                                              label: `${field.value}$`,
                                            }
                                          : null
                                      }
                                      onChange={(selected) => {
                                        const val = selected?.value || "";
                                        field.onChange(val);
                                        handleDiscountRateChange(index, val);
                                      }}
                                      onCreateOption={(inputValue) => {
                                        field.onChange(inputValue);
                                        handleDiscountRateChange(
                                          index,
                                          inputValue,
                                        );
                                      }}
                                      classNamePrefix="react-select"
                                      noOptionsMessage={() => "No option found"}
                                      formatCreateLabel={(inputValue) =>
                                        `Use "${inputValue}$"`
                                      }
                                      className="rebate-drop-down border-0 p-0 m-0"
                                      styles={{
                                        control: (base) => ({
                                          ...base,
                                          border: "none",
                                          boxShadow: "none",
                                          background: "transparent",
                                          minHeight: "unset",
                                        }),
                                        indicatorSeparator: () => ({
                                          display: "none",
                                        }),
                                      }}
                                    />
                                  )}
                                />
                              </td>

                              {/* Discount % */}
                              <td>
                                <input
                                  type="text"
                                  className="rebate-input-field border-0 p-0 m-0 outline-0"
                                  value={discountPercentage[index] || "-"}
                                  readOnly
                                  onChange={(e) =>
                                    setDiscountPercentage((prev) => ({
                                      ...prev,
                                      [index]: e.target.value,
                                    }))
                                  }
                                />
                              </td>

                              {/* Dealer Rebate $ */}
                              <td>
                                <input
                                  type="text"
                                  className="rebate-input-field border-0 p-0 m-0 outline-0"
                                  value={dealerRebate[index] || "-"}
                                  readOnly
                                  onChange={(e) =>
                                    setDealerRebate((prev) => ({
                                      ...prev,
                                      [index]: e.target.value,
                                    }))
                                  }
                                />
                              </td>

                              {/* Action */}
                              <td>
                                {fields.length > 1 && (
                                  <button
                                    onClick={() => removeRow(index)}
                                    style={{
                                      background: "none",
                                      border: "none",
                                      cursor: "pointer",
                                      padding: 0,
                                    }}
                                  >
                                    <img
                                      src={trashIcon}
                                      alt="trash Icon"
                                      width={"24px"}
                                      height={"24px"}
                                      loading="lazy"
                                    />
                                  </button>
                                )}
                              </td>
                            </tr>
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-2">
                  <div className="d-flex gap-2 flex-wrap">
                    <p className="mb-0 add-new-button p-0">
                      Add New
                      <img
                        src={AddIcon}
                        role="button"
                        alt="AddIcon"
                        tabIndex={0}
                        width={"24px"}
                        height={"24px"}
                        className="ms-2"
                        onClick={addNewRow}
                        onKeyDown={(e) =>
                          (e.key === "Enter" || e.key === " ") && addNewRow()
                        }
                      />
                    </p>
                  </div>
                  <p className="rebate-form-paragraph">
                    Having trouble submitting? Please report any technical
                    issues to{" "}
                    <a href="mailto:claims@stevenwillandinc.com" tabIndex={-1}>
                      claims@stevenwillandinc.com
                    </a>
                    .
                  </p>
                  <p className="mb-0 total-rebate-form">
                    Total Units: <span>{fields?.length}</span>
                  </p>
                  <div>
                    <p className="mb-0 total-rebate-form">
                      Total : <span>{getTotalMsrp()?.toFixed(2)}</span>
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClaimFormFormPageAdmin;
