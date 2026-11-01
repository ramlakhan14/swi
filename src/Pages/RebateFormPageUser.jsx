import React, { useEffect, useRef, useState } from 'react';
import HelmetComponent from '../components/HelmetComponent';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import TextInputWhiteBackground from '../components/TextInputWhiteBackground';
import SelectInput from '../components/SelectInput';
import AddIcon from '../assets/icons/ic-add.png';
import { showErrorToast, showSuccessToast } from '../utils/ToastUtils';
import { useUser } from '../context/UserContext';
import Loader from '../components/Loader';
import trashIcon from '../assets/icons/ic-trash-black.png';
import FileInputWhiteBackground from '../components/FileInputWhiteBackground';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import BackIcon from '../assets/icons/ic-back.png';
import { useNavigate } from 'react-router-dom';
import {
  createRebateFormAdmin,
  getDealerUser,
  getModelAdmin,
  getProductSerialAdmin,
  getRebateTypeAdmin,
  getSerialNumberVerificationAdmin,
} from '../services/rebateFormApiForUser';
import Select from 'react-select';

const RebateFormPageUser = () => {
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
    mode: 'onChange',
    defaultValues: {
      rows: [],
    },
  });
  const [dateOfSale, setDateOfSale] = useState(null);
  const navigate = useNavigate();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'rows',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [manufacturers, setManufacturers] = useState([]);
  const [isCommercialCustomer, setIsCommercialCustomer] = useState(1);
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
  const rebateValues = watch('type');
  const manufacturerId = watch('manufacturer_select');
  const userDealerId = watch('dealer_id');
  const dealerCustomerName = watch('dealer_customer_name');
  const selectedManufacturer = manufacturers.find(
    (m) => m.value == manufacturerId,
  );
  const manufacturerLabel = selectedManufacturer?.label?.toLowerCase() || '';
  const isLittleWonder =
    manufacturerLabel === 'little wonder' ||
    manufacturerLabel === 'classen' ||
    manufacturerLabel === 'mantis';

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
    name: 'type',
    label: 'Type of Rebate',
    required: true,
    options: [
      { value: 'bid', label: 'Bid' },
      { value: 'fleet', label: 'Fleet' },
      { value: 'openHouseFleet', label: 'Open House Fleet' },
    ],
  };

  const manufacturerField = {
    name: 'manufacturer_select',
    label: 'Manufacturer',
    required: true,
    options: manufacturers,
  };

  // Fetch manufacturers when rebate type changes
  useEffect(() => {
    const fetchManufacturers = async (rebateValues) => {
      try {
        const response = await getRebateTypeAdmin(rebateValues);
        const manufacturerOptions =
          response?.data?.products?.map((item) => ({
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

  // Fetch models when manufacturer is selected and initialize first row
  useEffect(() => {
    const fetchModels = async (id) => {
      try {
        if (userDealerId === '') {
          setError('dealer_id', {
            type: 'manual',
            message: 'Dealer ID is required',
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
            model_no: '',
            serial_no: '',
            dealer_custom: '',
            date_unit_sold: '',
            sell_price: '',
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
    setValue('manufacturer_select', '');
  };
  useEffect(() => {
    fetchUserData();
  }, [userDealerId]);

  const fetchDealerName = async () => {
    try {
      const response = await getDealerUser({ dealer_id: userDealerId });
      setValue('dealer_name', response?.data?.company_name || '');
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
  // Add new row
  const addNewRow = () => {
    const currentDealerName = watch('dealer_customer_name') || '';
    append({
      model_no: '',
      serial_no: '',
      dealer_custom: currentDealerName,
      date_unit_sold: dateOfSale ? new Date(dateOfSale) : '',
      sell_price: '',
    });
  };

  // Remove row - now properly handles the field array
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
  };

  // Get available models for a specific row (excluding already selected models)
  // const getAvailableModels = (currentRowIndex) => {
  //     const selectedModels = fields
  //         .map((field, idx) => {
  //             if (idx !== currentRowIndex) {
  //                 return watch(`rows.${idx}.model_no`);
  //             }
  //             return null;
  //         })
  //         .filter(Boolean);

  //     return modalsData.filter(model => !selectedModels.includes(model.value));
  // };

  const getAvailableModels = (currentRowIndex) => {
    return modalsData;
  };

  // REMOVE this filtering completely — it's causing value shifts
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

    // Agar current row ki selected value filter ho gayi, toh wapas add karo
    const alreadyInList = filtered.some((item) => item.value === currentVal);
    if (currentVal && !alreadyInList) {
      filtered.unshift({ value: currentVal, label: currentVal });
    }

    return filtered;
  };

  const fetchSerialNumbers = async (modelId, index) => {
    try {
      setIsLoading(true);

      // Pehle se selected value save karo
      const previouslySelected = watch(`rows.${index}.serial_no`);

      const response = await getProductSerialAdmin(modelId, userDealerId);
      const serialOptions =
        response?.data?.serials?.map((item) => ({
          value: item?.serial_number,
          label: item?.serial_number,
        })) || [];

      setSerialNumberData((prev) => ({ ...prev, [index]: serialOptions }));

      // Agar pehle se value selected thi toh wapas set karo
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
      if (name?.startsWith('rows.') && name.includes('model_no')) {
        const match = name.match(/rows\.(\d+)\./);
        if (match) {
          const index = parseInt(match[1]);

          // Sirf tab clear karo jab is row ka model_no change hua ho
          if (name === `rows.${index}.model_no`) {
            setValue(`rows.${index}.serial_no`, ''); // clear only this row
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
        name?.startsWith('rows.') &&
        (name.includes('model_no') || name.includes('serial_no'))
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

  useEffect(() => {
    const debounceTimers = {};

    const subscription = watch((value, { name }) => {
      if (name?.startsWith('rows.') && name.includes('sell_price')) {
        const match = name.match(/rows\.(\d+)\./);
        if (match) {
          const index = parseInt(match[1]);
          if (debounceTimers[index]) {
            clearTimeout(debounceTimers[index]);
          }
          debounceTimers[index] = setTimeout(() => {
            calculatePrice(index);
          }, 500);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, msrp, points]);

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
          [index]: response?.data?.part_number || '-',
        }));
        setPoints((prev) => ({
          ...prev,
          [index]:
            response?.data?.points === 0 ? '0' : response?.data?.points || '-',
        }));
        setMsrp((prev) => ({
          ...prev,
          [index]: response?.data?.msrp || '-',
        }));
      } catch (error) {
        showErrorToast(error?.response?.data?.message);
        setModelSerialValues((prev) => ({
          ...prev,
          [index]: '-',
        }));
        setPartNumber((prev) => ({
          ...prev,
          [index]: '-',
        }));
        setPoints((prev) => ({
          ...prev,
          [index]: '-',
        }));
        setMsrp((prev) => ({
          ...prev,
          [index]: '-',
        }));
        setDiscountDollar((prev) => ({ ...prev, [index]: '-' }));
        setDiscountPercentage((prev) => ({ ...prev, [index]: '-' }));
        setDealerRebate((prev) => ({ ...prev, [index]: '-' }));
      } finally {
        setIsLoading(false);
      }
    } else {
      setModelSerialValues((prev) => ({
        ...prev,
        [index]: '-',
      }));
      setPartNumber((prev) => ({
        ...prev,
        [index]: '-',
      }));
      setPoints((prev) => ({
        ...prev,
        [index]: '-',
      }));
      setMsrp((prev) => ({
        ...prev,
        [index]: '-',
      }));
      setDiscountDollar((prev) => ({ ...prev, [index]: '-' }));
      setDiscountPercentage((prev) => ({ ...prev, [index]: '-' }));
      setDealerRebate((prev) => ({ ...prev, [index]: '-' }));
    }
  };

  const calculatePrice = async (index) => {
    const sellPrice = watch(`rows.${index}.sell_price`);
    const isLittleWonder =
      manufacturerLabel === 'little wonder' ||
      manufacturerLabel === 'classen' ||
      manufacturerLabel === 'mantis';

    if (sellPrice) {
      // Parse and validate all required values
      const msrpValue = parseFloat(msrp[index]);
      const sellPriceValue = parseFloat(sellPrice);
      const pointsValue = parseFloat(points[index]) || 0;

      // Check if all values are valid numbers
      if (isNaN(msrpValue) || isNaN(sellPriceValue)) {
        // console.warn("Invalid values for calculation:", { msrpValue, sellPriceValue, pointsValue });
        setDiscountDollar((prev) => ({ ...prev, [index]: '-' }));
        setDiscountPercentage((prev) => ({ ...prev, [index]: '-' }));
        setDealerRebate((prev) => ({ ...prev, [index]: '-' }));
        return;
      }

      // Avoid division by zero
      if (msrpValue === 0) {
        // console.warn("MSRP is zero, cannot calculate percentage");
        setDiscountDollar((prev) => ({ ...prev, [index]: '-' }));
        setDiscountPercentage((prev) => ({ ...prev, [index]: '-' }));
        setDealerRebate((prev) => ({ ...prev, [index]: '-' }));
        return;
      }

      const discountDollar = msrpValue - sellPriceValue;
      const discountPercentage = (
        (1 - sellPriceValue / msrpValue) *
        100
      ).toFixed(2);
      const discountPercentageNum = parseFloat(discountPercentage);

      let dealerRebate = 0;
      // const discountPercentageNum = parseFloat(discountPercentage);
      // if (discountPercentageNum >= 10 && discountPercentageNum <= 19) {
      //     dealerRebate = discountDollar / 2;
      // } else if (discountPercentageNum >= 20) {
      //     dealerRebate = msrpValue * 0.10;
      // } else {
      //     dealerRebate = discountDollar;
      // }

      if (isLittleWonder) {
        if (discountPercentageNum < 10) {
          dealerRebate = 0;
        } else if (discountPercentageNum >= 10 && discountPercentageNum < 15) {
          dealerRebate = discountPercentageNum * 7;
        } else if (discountPercentageNum >= 15 && discountPercentageNum < 20) {
          dealerRebate = discountPercentageNum * 8.5;
        } else if (discountPercentageNum >= 20) {
          dealerRebate = discountPercentageNum * 10;
        }
      } else {
        if (discountPercentageNum >= 10 && discountPercentageNum < 20) {
          dealerRebate = discountDollar / 2;
        } else if (discountPercentageNum >= 20) {
          dealerRebate = msrpValue * 0.1;
        } else {
          dealerRebate = discountDollar;
        }
      }

      // Update state with calculated values
      setDiscountDollar((prev) => ({
        ...prev,
        [index]: !isNaN(discountDollar) ? discountDollar.toFixed(2) : '-',
      }));
      setDiscountPercentage((prev) => ({
        ...prev,
        [index]: !isNaN(discountPercentageNum) ? discountPercentage : '-',
      }));
      setDealerRebate((prev) => ({
        ...prev,
        [index]: !isNaN(dealerRebate) ? dealerRebate.toFixed(2) : '-',
      }));
    } else {
      // Clear values if sellPrice is empty
      setDiscountDollar((prev) => ({ ...prev, [index]: '-' }));
      setDiscountPercentage((prev) => ({ ...prev, [index]: '-' }));
      setDealerRebate((prev) => ({ ...prev, [index]: '-' }));
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
      commercial_customer: !isCommercialCustomer,
      ...(isCommercialCustomer === false && {
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        zip_code: data.zip_code || '',
      }),
      // date_of_sale: data.date_of_sale,
      invoice_number: data.invoice_number,
      date_of_sale: dateOfSale
        ? new Date(
            dateOfSale.getTime() - dateOfSale.getTimezoneOffset() * 60000,
          )
            .toISOString()
            .split('T')[0]
        : '',
      invoice_file: data.invoice_file,
      rebate_rows:
        data.rows?.map((row, index) => ({
          qty: 1,
          model_number: row.model_no || '',
          serial_number: row.serial_no || '',
          model_serial: modelSerialValues[index] || '',
          part_number: partNumber[index] || '',
          dealer_custom: row.dealer_custom || '',
          points: points[index] ? parseFloat(points[index]) : 0,
          msrp: msrp[index] ? parseFloat(msrp[index]) : 0,
          sell_price_bid_price: row.sell_price ? parseFloat(row.sell_price) : 0,
          // date_unit_sold: data.rows?.[index]?.date_unit_sold.toISOString().split('T')[0] || "",
          date_unit_sold: data.rows?.[index]?.date_unit_sold
            ? new Date(
                data.rows[index].date_unit_sold.getTime() -
                  data.rows[index].date_unit_sold.getTimezoneOffset() * 60000,
              )
                .toISOString()
                .split('T')[0]
            : '',
          discount_of_dollar:
            discountDollar[index] && discountDollar[index] !== '-'
              ? parseFloat(discountDollar[index])
              : 0,

          discount_of_percentage:
            discountPercentage[index] && discountPercentage[index] !== '-'
              ? parseFloat(discountPercentage[index])
              : 0,
          ...(isLittleWonder && {
            dealer_actual_cost: row.dealer_actual_cost
              ? parseFloat(row.dealer_actual_cost)
              : 0,
          }),
          dealer_rebate_dollar:
            dealerRebate[index] && dealerRebate[index] !== '-'
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
      const response = await createRebateFormAdmin(formData);
      showSuccessToast(response?.message);
      reset({
        type: '',
        acknowledgement: false,
        manufacturer_select: '',
        dealer_name: '',
        dealer_signature: '',
        dealer_customer_name: '',
        dealer_id: '',
        date_of_sale: '',
        invoice_number: '',
        invoice_file: null,
        rows: [],
        address: '',
        city: '',
        state: '',
        zip_code: '',
      });
      setIsCommercialCustomer(1);
      fileInputRef.current?.resetFileName();
      setModelSerialValues({});
      setPartNumber({});
      setPoints({});
      setMsrp({});
      setDiscountDollar({});
      setDiscountPercentage({});
      setDealerRebate({});
      setDealerActualCost({});
      setDateOfSale(null);
    } catch (error) {
      if (error?.response?.data.responseCode === 422) {
        return showErrorToast(
          Object.values(error?.response?.data?.messages)[0][0] ||
            'Failed to rebate form',
        );
      } else {
        showErrorToast(error?.response?.data?.message);
      }
    }
  };
  return (
    <>
      <HelmetComponent
        title="Rebate Form | SWI"
        description="This is the description for the rebate form page."
        keywords="react, helmet, seo"
        canonicalUrl=""
        customMeta={[
          { name: 'robots', content: 'index, follow' },
          { name: 'author', content: 'Ritik Jain' },
          { property: 'og:title', content: 'My React App' },
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
                // if (e.key === 'Enter') e.preventDefault();
                if (
                  e.key === ' ' &&
                  e.target.tagName !== 'INPUT' &&
                  e.target.tagName !== 'TEXTAREA'
                )
                  e.preventDefault();
              }}
            >
              <div
                className="col-12 homepage-left-div common-page-div"
                style={{ borderRadius: '12px' }}
              >
                <div className="name-part">
                  <div className="d-flex justify-content-between align-items-center">
                    <h2>Rebate Form</h2>
                    <div>
                      <button
                        type="button"
                        className="btn btn-dark black-btn"
                        style={{ padding: '10px' }}
                        onClick={() => navigate('/')}
                      >
                        <img
                          src={BackIcon}
                          alt="Back Icon"
                          width={'24px'}
                          height={'24px'}
                          loading="lazy"
                        />
                      </button>
                      <button
                        type="submit"
                        className="btn btn-success green-btn swi-edi-login-btn"
                        style={{ padding: '12px 24px' }}
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
                          'Submit '
                        )}
                      </button>
                    </div>
                  </div>
                  <hr
                    style={{
                      borderColor: '#E4E4E7',
                      margin: '20px 0',
                      opacity: '1',
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
                        required: 'SWI Dealer ID Number is required',
                        minLength: {
                          value: 3,
                          message:
                            'SWI Dealer ID Number must be at least 3 characters long',
                        },
                      }}
                      containerStyle={{ paddingBottom: '20px' }}
                    />
                  </div>
                  <div className="col-12 col-md-4">
                    <SelectInput
                      field={rebateField}
                      register={register}
                      error={errors.type}
                      className="form-select-input"
                      containerStyle={{ marginBottom: '20px' }}
                    />
                  </div>
                  <div className="col-12 col-md-4">
                    <SelectInput
                      field={manufacturerField}
                      register={register}
                      error={errors.manufacturer_select}
                      className="form-select-input"
                      containerStyle={{ marginBottom: '20px' }}
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
                        required: 'Dealer Name is required',
                        minLength: {
                          value: 2,
                          message:
                            'Dealer Name must be at least 2 characters long',
                        },
                      }}
                      containerStyle={{ paddingBottom: '20px' }}
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
                        required: 'Dealer Signature is required',
                        minLength: {
                          value: 2,
                          message:
                            'Dealer Signature must be at least 2 characters long',
                        },
                      }}
                      containerStyle={{ paddingBottom: '5px' }}
                    />
                    <div
                      className="form-check"
                      style={{ paddingBottom: '20px' }}
                    >
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`product_ids`}
                        {...register('acknowledgement')}
                      />
                      <label
                        className="form-check-label modal-para-text ms-1 mb-0"
                        htmlFor="product_ids"
                        style={{ fontSize: '14px', color: '#666' }}
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
                      placeholder="Enter your fleet program customer name here"
                      label="Fleet Program Customer Name"
                      register={register}
                      error={errors.dealer_customer_name}
                      validation={{
                        // required: 'Fleet Program Customer Name is required',
                        minLength: {
                          value: 2,
                          message:
                            'Fleet Program Customer Name must be at least 2 characters long',
                        },
                      }}
                      containerStyle={{ paddingBottom: '20px' }}
                    />
                  </div>
                  <div className="col-12 col-md-4">
                    <div
                      className="form-check"
                      style={{ paddingTop: '30px', paddingBottom: '20px' }}
                    >
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="commercial_customer"
                        checked={isCommercialCustomer}
                        style={{ cursor: 'pointer' }}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setIsCommercialCustomer(checked);

                          // Clear commercial customer fields when checkbox is checked
                          if (checked) {
                            setValue('address', '');
                            setValue('city', '');
                            setValue('state', '');
                            setValue('zip_code', '');
                          }
                        }}
                      />
                      <label
                        className="form-check-label modal-para-text ms-1 mb-0"
                        htmlFor="commercial_customer"
                        style={{
                          fontSize: '14px',
                          color: '#666',
                          cursor: 'pointer',
                        }}
                      >
                        Commercial Customer
                      </label>
                    </div>
                  </div>
                </div>

                {!isCommercialCustomer && (
                  <div className="row align-items-start">
                    <div className="col-12 col-md-3">
                      <TextInputWhiteBackground
                        name="address"
                        type="text"
                        placeholder="Enter address"
                        label="Address"
                        register={register}
                        error={errors.address}
                        validation={{
                          required: 'Address is required',
                          minLength: {
                            value: 5,
                            message:
                              'Address must be at least 5 characters long',
                          },
                          maxLength: {
                            value: 250,
                            message: 'Address cannot exceed 250 characters',
                          },
                        }}
                        inputProps={{ maxLength: 100 }}
                        containerStyle={{ paddingBottom: '20px' }}
                      />
                    </div>
                    <div className="col-12 col-md-3">
                      <TextInputWhiteBackground
                        name="city"
                        type="text"
                        placeholder="Enter city"
                        label="City"
                        register={register}
                        error={errors.city}
                        validation={{
                          required: 'City is required',
                          minLength: {
                            value: 2,
                            message: 'City must be at least 2 characters long',
                          },
                          maxLength: {
                            value: 100,
                            message: 'City cannot exceed 100 characters',
                          },
                          pattern: {
                            value: /^[a-zA-Z\s]+$/,
                            message: 'City can only contain letters and spaces',
                          },
                        }}
                        inputProps={{ maxLength: 100 }}
                        containerStyle={{ paddingBottom: '20px' }}
                      />
                    </div>
                    <div className="col-12 col-md-3">
                      <TextInputWhiteBackground
                        name="state"
                        type="text"
                        placeholder="Enter state (e.g., CA)"
                        label="State"
                        register={register}
                        error={errors.state}
                        validation={{
                          required: 'State is required',
                          minLength: {
                            value: 2,
                            message: 'State must be 2 characters',
                          },
                          maxLength: {
                            value: 100,
                            message: 'state cannot exceed 100 characters',
                          },
                        }}
                        inputProps={{ maxLength: 100 }}
                        containerStyle={{ paddingBottom: '20px' }}
                      />
                    </div>
                    <div className="col-12 col-md-3">
                      <TextInputWhiteBackground
                        name="zip_code"
                        type="text"
                        placeholder="Enter zip code"
                        label="Zip Code"
                        register={register}
                        error={errors.zip_code}
                        validation={{
                          required: 'Zip Code is required',
                          pattern: {
                            value: /^\d{6}$/,
                            message: 'Zip Code must be exactly 6 digits',
                          },
                          onChange: (e) => {
                            e.target.value = e.target.value
                              .replace(/\D/g, '')
                              .slice(0, 6);
                          },
                        }}
                        containerStyle={{ paddingBottom: '20px' }}
                      />
                    </div>
                  </div>
                )}

                <div className="row align-items-start">
                  <div className="col-12 col-md-4">
                    {/* <TextInputWhiteBackground
                                            name="date_of_sale"
                                            type="date"
                                            placeholder="Enter your ccccdate of sale here"
                                            label="Date of Sale"
                                            register={register}

                                            error={errors.date_of_sale}
                                            validation={{
                                                required: 'Date of Sale is required'
                                            }}
                                            containerStyle={{ paddingBottom: "20px" }}
                                        /> */}
                    <div className="form-group">
                      <label htmlFor="dateOfSale" className="form-label me-3">
                        Date of Sale:
                      </label>
                      <Controller
                        name="dateOfSale"
                        control={control}
                        rules={{ required: 'Date of Sale is required' }}
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
                            className={`form-control ${
                              errors.dateOfSale ? 'is-invalid' : ''
                            }`}
                            showIcon
                          />
                        )}
                      />
                      {errors.dateOfSale && (
                        <div className="invalid-feedback d-block pt-1">
                          {errors.dateOfSale.message}
                        </div>
                      )}
                      {/* <DatePicker
                                                id="dateOfSale"
                                                selected={dateOfSale}
                                                onChange={(date) => setDateOfSale(date)}
                                                dateFormat="MM-dd-yyyy"
                                                placeholderText="mm-dd-yyyy"
                                                className="form-control"
                                                showIcon
                                                required
                                            /> */}
                      {/* {!dateOfSale && (
                                                    <div className="text-danger" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                                        Date of Sale is required
                                                    </div>
                                                )} */}
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
                        required: 'Invoice Number is required',
                        minLength: {
                          value: 3,
                          message:
                            'Invoice Number must be at least 3 characters long',
                        },
                      }}
                      containerStyle={{ paddingBottom: '20px' }}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div className="d-flex align-items-center mb-3">
                      <p
                        className="modal-headding-text mb-0"
                        style={{ minWidth: '180px', fontWeight: '500' }}
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
                          required: 'Please select a file',
                          validate: {
                            fileSize: (files) =>
                              !files[0] ||
                              files[0].size <= 100 * 1024 * 1024 ||
                              'File size must be less than 100MB',
                            fileType: (files) =>
                              !files[0] ||
                              [
                                'application/pdf',
                                'text/csv',
                                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
                                'application/vnd.ms-excel', // .xls
                                'application/msword', // .doc
                                'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
                              ].includes(files[0].type) ||
                              'Only PDF, CSV, Excel, or Word files are allowed',
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
                      style={{ color: 'red', fontSize: '14px' }}
                    >
                      Serial number missing? This means the serial number has
                      already been used
                    </p>
                  )}
                </div>
                <div
                  className="table-responsive table-rebate overflow-auto mt-2"
                  style={{
                    maxHeight: '340px',
                    minHeight: '340px',
                    border: '1px solid #E4E4E7',
                    borderRadius: '12px',
                  }}
                >
                  <table className="w-100 mt-0 border-0">
                    <thead
                      style={{
                        backgroundColor: '#F4F4F5',
                        position: 'sticky',
                        top: 0,
                        zIndex: 2,
                      }}
                    >
                      <tr className="rebate-table">
                        <th
                          scope="col"
                          style={{ padding: '8px 16px', minWidth: '72px' }}
                        >
                          QTY
                        </th>
                        <th scope="col" style={{ minWidth: '154px' }}>
                          Model
                        </th>
                        <th scope="col" style={{ minWidth: '200px' }}>
                          Serial No.
                        </th>
                        <th scope="col" style={{ minWidth: '154px' }}>
                          Model-Serial-Dealer
                        </th>
                        <th scope="col" style={{ minWidth: '79px' }}>
                          Part No.
                        </th>
                        <th scope="col" style={{ minWidth: '119px' }}>
                          Dealer Customer Name
                        </th>
                        <th scope="col" style={{ minWidth: '111px' }}>
                          Date Unit Sold
                        </th>
                        <th scope="col" style={{ minWidth: '112px' }}>
                          Points
                        </th>
                        <th scope="col" style={{ minWidth: '70px' }}>
                          MSRP
                        </th>
                        <th scope="col" style={{ minWidth: '154px' }}>
                          Sell Price/Bid Price
                        </th>
                        {isLittleWonder && (
                          <th scope="col" style={{ minWidth: '154px' }}>
                            Dealer Actual Cost
                          </th>
                        )}
                        <th scope="col" style={{ minWidth: '140px' }}>
                          Discount $
                        </th>
                        <th scope="col" style={{ minWidth: '140px' }}>
                          Discount %
                        </th>
                        <th scope="col" style={{ minWidth: '140px' }}>
                          Dealer Rebate $
                        </th>
                        <th scope="col" style={{ minWidth: '80px' }}>
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
                            {/* {index === 1 && <tr style={{ color: "red", fontSize: "12px" }}><td colSpan={"14"} className="ps-5">Serial number missing? This means the serial number has already been used.</td></tr>} */}
                            <tr
                              className="rebate-table"
                              style={{ borderTop: '1px solid #E4E4E7' }}
                            >
                              <td style={{ padding: '12px 16px' }}>1</td>
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
                                        field.onChange(selected?.value || '')
                                      }
                                      classNamePrefix="react-select"
                                      noOptionsMessage={() =>
                                        'No serial no. found'
                                      }
                                      className="rebate-drop-down border-0 p-0 m-0"
                                      styles={{
                                        control: (base) => ({
                                          ...base,
                                          border: 'none',
                                          boxShadow: 'none',
                                          background: 'transparent',
                                          minHeight: 'unset',
                                        }),
                                        indicatorSeparator: () => ({
                                          display: 'none',
                                        }),
                                      }}
                                    />
                                  )}
                                />
                              </td>
                              <td>
                                {/* <input
                                                                type="text"
                                                                className="rebate-input-field border-0 p-0 m-0 outline-0"
                                                                value={}
                                                                readOnly
                                                                style={{ backgroundColor: 'transparent' }}
                                                            /> */}
                                {modelSerialValues[index] || '-'}
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="rebate-input-field border-0 p-0 m-0 outline-0"
                                  value={partNumber[index] || '-'}
                                  readOnly
                                  style={{ backgroundColor: 'transparent' }}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className={`rebate-input-field border-0 p-0 m-0 outline-0 ${
                                    errors?.rows?.[index]?.dealer_custom
                                      ? 'is-invalid'
                                      : ''
                                  }`}
                                  {...register(`rows.${index}.dealer_custom`, {
                                    required: 'Dealer Custom is required',
                                  })}
                                />
                              </td>
                              <td>
                                {/* <input
                                                                type="date"
                                                                className={`rebate-input-field border-0 p-0 m-0 outline-0 ${errors?.rows?.[index]?.date_unit_sold ? "is-invalid" : ""
                                                                    }`}
                                                                {...register(`rows.${index}.date_unit_sold`, {
                                                                    required: "Date Unit Sold is required",
                                                                })}
                                                            /> */}
                                <Controller
                                  control={control}
                                  name={`rows.${index}.date_unit_sold`}
                                  rules={{
                                    required: 'Date Unit Sold is required',
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
                                      className={`rebate-input-field date-picker-td border-0 p-0 m-0 outline-0 form-control ${
                                        errors?.rows?.[index]?.date_unit_sold
                                          ? 'is-invalid'
                                          : ''
                                      }`}
                                      // showIcon
                                    />
                                  )}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="rebate-input-field border-0 p-0 m-0 outline-0"
                                  value={points[index] || '-'}
                                  readOnly
                                  style={{ backgroundColor: 'transparent' }}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="rebate-input-field border-0 p-0 m-0 outline-0"
                                  value={msrp[index] || '-'}
                                  readOnly
                                  style={{ backgroundColor: 'transparent' }}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className={`rebate-input-field border-0 p-0 m-0 outline-0 ${
                                    errors?.rows?.[index]?.sell_price
                                      ? 'is-invalid'
                                      : ''
                                  }`}
                                  {...register(`rows.${index}.sell_price`, {
                                    required: 'Sell Price is required',
                                  })}
                                />
                              </td>
                              {isLittleWonder && (
                                <td>
                                  <input
                                    type="text"
                                    className={`rebate-input-field border-0 p-0 m-0 outline-0 ${
                                      errors?.rows?.[index]?.dealer_actual_cost
                                        ? 'is-invalid'
                                        : ''
                                    }`}
                                    {...register(
                                      `rows.${index}.dealer_actual_cost`,
                                    )}
                                  />
                                </td>
                              )}
                              <td>
                                <input
                                  type="text"
                                  className="rebate-input-field border-0 p-0 m-0 outline-0"
                                  value={discountDollar[index] || '-'}
                                  readOnly
                                  onChange={(e) =>
                                    setDiscountDollar((prev) => ({
                                      ...prev,
                                      [index]: e.target.value,
                                    }))
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="rebate-input-field border-0 p-0 m-0 outline-0"
                                  value={discountPercentage[index] || '-'}
                                  readOnly
                                  onChange={(e) =>
                                    setDiscountPercentage((prev) => ({
                                      ...prev,
                                      [index]: e.target.value,
                                    }))
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="rebate-input-field border-0 p-0 m-0 outline-0"
                                  value={dealerRebate[index] || '-'}
                                  readOnly
                                  onChange={(e) =>
                                    setDealerRebate((prev) => ({
                                      ...prev,
                                      [index]: e.target.value,
                                    }))
                                  }
                                />
                              </td>
                              <td>
                                {fields.length > 1 && (
                                  <button
                                    onClick={() => removeRow(index)}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      cursor: 'pointer',
                                      padding: 0,
                                    }}
                                  >
                                    <img
                                      src={trashIcon}
                                      alt="trash Icon"
                                      width={'24px'}
                                      height={'24px'}
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
                        width={'24px'}
                        height={'24px'}
                        className="ms-2"
                        onClick={addNewRow}
                        onKeyDown={(e) =>
                          (e.key === 'Enter' || e.key === ' ') && addNewRow()
                        }
                      />
                    </p>
                  </div>
                  <p className="rebate-form-paragraph">
                    Having trouble submitting? Please report any technical
                    issues to{' '}
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

export default RebateFormPageUser;
