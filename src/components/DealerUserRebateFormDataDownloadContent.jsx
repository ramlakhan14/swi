import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import InnerPageTopBar from './InnerPageTopBar';
import { showErrorToast, showSuccessToast } from '../utils/ToastUtils';
import HelmetComponent from './HelmetComponent';
import 'react-datepicker/dist/react-datepicker.css';
import { useUser } from '../context/UserContext';
import { exportDealerUserRebateData } from '../services/dealerUserApi';

const DealerUserRebateFormDataDownloadContent = () => {
  const { user } = useUser();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    reset,
    trigger,
  } = useForm({
    defaultValues: {
      startDate: null,
      endDate: null,
    },
    mode: 'onChange',
  });

  const [isLoading, setIsLoading] = useState(false);

  const fetchGetAllFiles = async (data) => {
    const { startDate, endDate } = data;

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

    setIsLoading(true);
    try {
      const response = await exportDealerUserRebateData(
        user?.id,
        startDateParam,
        endDateParam,
      );

      // Create blob from response and trigger download
      const blob = new Blob([response.data], {
        type:
          response.headers['content-type'] ||
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `rebate_data_${startDateParam || 'all'}_to_${
        endDateParam || 'all'
      }_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
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
            {/* Start Date */}
            <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3 mb-sm-0">
              <label className="form-label modal-headding-text mb-2">
                Start Date:
              </label>

              <Controller
                name="startDate"
                control={control}
                rules={{
                  validate: (value) => {
                    const endDate = getValues('endDate');

                    if (endDate && !value) {
                      return 'Start date is required when end date is selected';
                    }

                    return true;
                  },
                }}
                render={({ field }) => (
                  <div style={{ width: '100%' }}>
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
                      wrapperClassName="w-100"
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

            {/* End Date */}
            <div className="col-12 col-sm-6 col-md-4 col-lg-3">
              <label className="form-label modal-headding-text mb-2">
                End Date:
              </label>

              <Controller
                name="endDate"
                control={control}
                rules={{
                  validate: (value) => {
                    const startDate = getValues('startDate');

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
                  <div style={{ width: '100%' }}>
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
                      wrapperClassName="w-100"
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

export default DealerUserRebateFormDataDownloadContent;
