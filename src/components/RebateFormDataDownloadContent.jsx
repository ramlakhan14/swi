import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import InnerPageTopBar from './InnerPageTopBar';
import { showErrorToast, showSuccessToast } from '../utils/ToastUtils';
import HelmetComponent from './HelmetComponent';
import 'react-datepicker/dist/react-datepicker.css';
import { getDealerList } from '../services/adminApi';
const RebateFormDataDownloadContent = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
    setValue,
    getValues,
    reset,
    watch,
    trigger,
  } = useForm({
    defaultValues: {
      startDate: null,
      endDate: null,
      dealer_id: '',
    },
    mode: 'onChange', // This will validate on change
  });

  const [isLoading, setIsLoading] = useState(false);
  const [dealerList, setDealerList] = useState([]);

  useEffect(() => {
    const fetchDealerList = async () => {
      try {
        const response = await getDealerList();
        setDealerList(response?.data || response || []);
      } catch (error) {
        console.error('Error fetching dealer list:', error);
      }
    };
    fetchDealerList();
  }, []);

  const fetchGetAllFiles = async (data) => {
    const { startDate, endDate, dealerId } = data;

    const formatDateForURL = (date) => {
      if (!date) return '';
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const startDateParam = formatDateForURL(startDate);
    const endDateParam = formatDateForURL(endDate);

    // let url = `${import.meta.env.VITE_API_BASE_URL}/admin/export-rebate-data`;
    // if (startDateParam && endDateParam) {
    //   url += `?start_date=${startDateParam}&end_date=${endDateParam}`;
    // }

    let url = `${import.meta.env.VITE_API_BASE_URL}/admin/export-rebate-data`;

    const params = new URLSearchParams();

    if (startDateParam && endDateParam) {
      params.append('start_date', startDateParam);
      params.append('end_date', endDateParam);
    }

    if (dealerId) {
      params.append('dealer_id', dealerId);
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    setIsLoading(true);
    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = `rebate_data_${startDateParam || 'all'}_to_${
        endDateParam || 'all'
      }_${new Date().toISOString().split('T')[0]}.xlsx`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      reset();
      showSuccessToast('File downloaded successfully! ✅');
    } catch (error) {
      showErrorToast('Failed to download file. Please refresh and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <HelmetComponent
        title="Rebate Form Data Download | SWI"
        description="This is the description for the rebate form data download page."
        keywords="react, helmet, seo"
        canonicalUrl=""
        customMeta={[
          { name: 'robots', content: 'index, follow' },
          { name: 'author', content: 'Ritik Jain' },
          { property: 'og:title', content: 'My React App' },
        ]}
      />
      <InnerPageTopBar />
      <div className="name-part" style={{ marginTop: '20px' }}>
        <h2>Rebate Form Data Download</h2>
        <hr
          style={{ borderColor: '#E4E4E7', margin: '20px 0', opacity: '1' }}
        />
      </div>

      <form onSubmit={handleSubmit(fetchGetAllFiles)}>
        <div>
          <p className="new-paragraph mb-3">
            Export rebate form submissions within a specific date range. Leave
            both dates empty to download all records. Data will be exported in
            Excel format.
          </p>

          <div className="row mb-3">
            {/* <div className="row-md-3">
  <label className="form-label modal-headding-text mb-2">
    Dealer Name:
  </label>

  <Controller
    name="dealerId"
    control={control}
    render={({ field }) => (
      <Select
        {...field}
        className="form-control"
         style={{
          width: "235px",
          // overflowY: "auto",
          height: "200px",
        }}
      >
        
        <option value="">Select Dealer</option>

        {dealerList.map((dealer) => (
          <option
            key={dealer.id}
            value={dealer.id}
          >
            {dealer.name}
          </option>
        ))}
      </Select>
    )}
  />
</div> */}

            <div className="row-md-3">
              <label className="form-label modal-headding-text mb-2">
                Dealer Name:
              </label>
              <Controller
                name="dealerId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={dealerList.map((dealer) => ({
                      value: dealer.id,
                      label: dealer.name,
                    }))}
                    value={
                      dealerList
                        .map((dealer) => ({
                          value: dealer.id,
                          label: dealer.name,
                        }))
                        .find((option) => option.value === field.value) || null
                    }
                    onChange={(selected) => {
                      field.onChange(selected ? selected.value : '');
                    }}
                    placeholder="Select Dealer"
                    isClearable
                    styles={{
                      container: (provided) => ({
                        ...provided,
                        width: '235px',
                      }),
                      menuList: (provided) => ({
                        ...provided,
                        maxHeight: '200px',
                        overflowY: 'auto',
                      }),
                    }}
                  />
                )}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label modal-headding-text mb-2">
                Start Date:
              </label>
              <Controller
                name="startDate"
                control={control}
                rules={{
                  validate: (value) => {
                    const endDate = getValues('endDate');
                    // Only validate if end date exists
                    if (endDate && !value) {
                      return 'Start date is required when end date is selected';
                    }
                    return true;
                  },
                }}
                render={({ field }) => (
                  <div>
                    <DatePicker
                      {...field}
                      selected={field.value}
                      onChange={(date) => {
                        field.onChange(date);
                        const endDate = getValues('endDate');
                        if (endDate && date > endDate) {
                          setValue('endDate', null);
                        }
                        trigger('endDate');
                      }}
                      selectsStart
                      startDate={field.value}
                      endDate={getValues('endDate')}
                      dateFormat="MM-dd-yyyy"
                      placeholderText="mm-dd-yyyy"
                      className={`form-control ${
                        errors.startDate ? 'is-invalid' : ''
                      }`}
                      showIcon
                      maxDate={new Date()}
                    />
                    {errors.startDate && (
                      <div className="invalid-feedback d-block">
                        {errors.startDate.message}
                      </div>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label modal-headding-text mb-2">
                End Date:
              </label>
              <Controller
                name="endDate"
                control={control}
                rules={{
                  validate: (value) => {
                    const startDate = getValues('startDate');
                    // Only validate if start date exists
                    if (startDate && !value) {
                      return 'End date is required when start date is selected';
                    }
                    if (startDate && value && value < startDate) {
                      return 'End date cannot be before start date';
                    }
                    return true;
                  },
                }}
                render={({ field }) => (
                  <div>
                    <DatePicker
                      {...field}
                      selected={field.value}
                      onChange={(date) => {
                        field.onChange(date);
                        trigger('startDate');
                      }}
                      selectsEnd
                      startDate={getValues('startDate')}
                      endDate={field.value}
                      minDate={getValues('startDate')}
                      dateFormat="MM-dd-yyyy"
                      placeholderText="mm-dd-yyyy"
                      className={`form-control ${
                        errors.endDate ? 'is-invalid' : ''
                      }`}
                      showIcon
                      maxDate={new Date()}
                    />
                    {errors.endDate && (
                      <div className="invalid-feedback d-block">
                        {errors.endDate.message}
                      </div>
                    )}
                  </div>
                )}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-dark black-btn-hover-white"
            style={{
              fontSize: '12px',
              fontWeight: '700',
              padding: '12px 24px',
            }}
            disabled={isLoading}
          >
            {isLoading ? 'Exporting...' : 'Export Rebate Form Data'}
          </button>
        </div>
      </form>
    </>
  );
};

export default RebateFormDataDownloadContent;
