import React, { useEffect, useState } from 'react';
import InnerPageTopBar from './InnerPageTopBar';
import TextInputWhiteBackground from './TextInputWhiteBackground';
import AddIcon from "../assets/icons/ic-add.png";
import { useForm } from 'react-hook-form';
import trashIcon from "../assets/icons/ic-trash-black.png";
import { showErrorToast, showSuccessToast } from '../utils/ToastUtils';
import { getAllSalesPerson, deleteSalesPerson, createSalesPerson, UpdateSalesPerson } from '../services/SalesForceAPI.js';
import HelmetComponent from './HelmetComponent.jsx';

const SalesForceContent = () => {
  const [salespeople, setSalespeople] = useState([]);
  const [newRows, setNewRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, setValue, watch, setError, formState: { errors } } = useForm();

  const toggleCheck = (id) => {
    setSalespeople(salespeople.map(sp =>
      sp.id === id ? { ...sp, checked: !sp.checked } : sp
    ));
  };

  const addNewRow = () => {
    const newRow = {
      tempId: Date.now(),
      name: '',
      code: ''
    };
    setNewRows([...newRows, newRow]);
  };

  const removeNewRow = (tempId) => {
    setNewRows(newRows.filter(row => row.tempId !== tempId));
    setValue(`sales_person-${tempId}`, '');
    setValue(`code-${tempId}`, '');
  };

  useEffect(() => {
    salespeople.forEach(sp => {
      setValue(`sales_person-${sp.id}`, sp.sales_person_name);
      setValue(`code-${sp.id}`, sp.code);
    });
  }, [salespeople, setValue]);

  const fetchGetAllSalesPerson = async () => {
    try {
      const response = await getAllSalesPerson();
      const data = response?.data?.data || [];
      setSalespeople(data.map(sp => ({ ...sp, checked: false })));
    } catch (error) {
      console.error('Error fetching sales person data:', error);
      showErrorToast("An error occurred while fetching the sales person data. Please refresh and try again.");
    }
  };

  useEffect(() => {
    fetchGetAllSalesPerson();
  }, []);

  const saveAll = async (data) => {
    try {
      setIsLoading(true);

      // 1. Delete checked rows
      const checkedSalespeople = salespeople.filter(sp => sp.checked);
      if (checkedSalespeople.length > 0) {
        const idsToDelete = checkedSalespeople.map(sp => sp.id);
        try {
          const response = await deleteSalesPerson({ ids: idsToDelete });
          showSuccessToast(response?.message || "Salespeople deleted successfully");
        } catch (error) {
          showErrorToast(error?.response?.data?.message || "Failed to delete salesperson");
        }
      }

      // 2. Update existing rows (that are not checked for deletion)
      const uncheckedSalespeople = salespeople.filter(sp => !sp.checked);
      const updatedData = [];
      uncheckedSalespeople.forEach(sp => {
        const updatedName = watch(`sales_person-${sp.id}`) || sp.sales_person_name;
        const updatedCode = watch(`code-${sp.id}`) || sp.code;

        // Only include if values have changed
        if (updatedName !== sp.sales_person_name || updatedCode !== sp.code) {
          updatedData.push({
            id: sp.id,
            name: updatedName,
            code: updatedCode
          });
        }
      });

      // Send update request only if there are changes
      if (updatedData.length > 0) {
        const formData = new FormData();
        updatedData.forEach((row, index) => {
          Object.keys(row).forEach((key) => {
            formData.append(`sales_person[${index}][${key}]`, row[key]);
          });
        });

        try {
          const response = await UpdateSalesPerson(formData);
          showSuccessToast(response?.message || "Salespeople updated successfully");
        } catch (error) {
          if (error?.response?.data.responseCode === 422) {
            return showErrorToast(Object.values(error?.response?.data?.messages)[0][0] || "Failed to create salesperson");
          }
          showErrorToast(error?.response?.data?.messages || "Failed to create salesperson");
        }
      }

      // 3. Add new rows
      const newSalespeopleData = newRows.map(row => ({
        name: watch(`sales_person-${row.tempId}`) || '',
        code: watch(`code-${row.tempId}`) || ''
      }));

      const validNewRows = newSalespeopleData.filter(row =>
        row.name.trim() && row.code.trim()
      );

      if (validNewRows.length > 0) {
        const formData = new FormData();
        validNewRows.forEach((row, index) => {
          Object.keys(row).forEach((key) => {
            formData.append(`sales_person[${index}][${key}]`, row[key]);
          });
        });

        try {
          const response = await createSalesPerson(formData);
          showSuccessToast(response?.message || "Salespeople created successfully");
        } catch (error) {
          if (error?.response?.data.responseCode === 422) {
            return showErrorToast(Object.values(error?.response?.data?.messages)[0][0] || "Failed to create salesperson");
          }
          showErrorToast(error?.response?.data?.messages || "Failed to create salesperson");
        }
      }

      // Clear new rows after successful save
      setNewRows([]);

      // Refresh the list
      await fetchGetAllSalesPerson();

    } catch (error) {
      console.error('Error saving sales force data:', error);
      showErrorToast("An error occurred while saving. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <HelmetComponent
        title="Sales Force | SWI"
        description="This is the description for the sales force page."
        keywords="react, helmet, seo"
        canonicalUrl=""
        customMeta={[
          { name: "robots", content: "index, follow" },
          { name: "author", content: "Ritik Jain" },
          { property: "og:title", content: "My React App" }
        ]}
      />
      <InnerPageTopBar />
      <form onSubmit={handleSubmit(saveAll)} noValidate>
        <div className="name-part" style={{ marginTop: "20px" }}>
          <div className='d-flex justify-content-between'>
            <h2>Sales Force</h2>
            <button
              type="submit"
              className="btn btn-success green-btn"
              style={{
                padding: "12px 24px",
                fontSize: "12px",
                fontWeight: "700",
                whiteSpace: 'nowrap'
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </button>
          </div>
          <hr style={{ borderColor: "#E4E4E7", margin: "20px 0", opacity: "1" }} />
        </div>
        <div className='brand-vertical-left-div'>
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th className="table-header delete-col border-0">DELETE</th>
                  <th className="table-header salesperson-col border-0">SALESPERSON</th>
                  <th className="table-header code-col border-0">CODE</th>
                </tr>
              </thead>

              <tbody>
                {salespeople.map((sp) => (
                  <tr key={sp.id}>
                    <td className='border-0'>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={sp.checked}
                        onChange={() => toggleCheck(sp.id)}
                        style={{ cursor: 'pointer' }}
                      />
                    </td>
                    <td className='border-0'>
                      <TextInputWhiteBackground
                        name={`sales_person-${sp.id}`}
                        type="text"
                        placeholder="Salesperson"
                        label="Salesperson"
                        register={register}
                        error={errors[`sales_person-${sp.id}`]}
                        containerStyle={{ marginBottom: 0 }}
                      />
                    </td>
                    <td className='border-0'>
                      <TextInputWhiteBackground
                        name={`code-${sp.id}`}
                        type="number"
                        placeholder="Code"
                        label="Code"
                        register={register}
                        error={errors[`code-${sp.id}`]}
                        containerStyle={{ marginBottom: 0 }}
                      />
                    </td>
                  </tr>
                ))}

                {newRows.map((row) => (
                  <tr key={row.tempId}>
                    <td className='border-0'>
                      <button
                        type="button"
                        className="btn btn-sm btn-link text-danger p-0"
                        onClick={() => removeNewRow(row.tempId)}
                        title="Remove this row"
                      >
                        <img src={trashIcon} alt='trash Icon' width={"24px"} height={"24px"} loading="lazy" />
                      </button>
                    </td>
                    <td className='border-0'>
                      <TextInputWhiteBackground
                        name={`sales_person-${row.tempId}`}
                        type="text"
                        placeholder="Enter salesperson name"
                        label="Salesperson"
                        register={register}
                        error={errors[`sales_person-${row.tempId}`]}
                        validation={{
                          required: "Salesperson name is required",
                          minLength: {
                            value: 3,
                            message: "Salesperson name must be at least 3 characters long"
                          },
                          maxLength: {
                            value: 100,
                            message: "Salesperson name cannot be more than 100 characters"
                          }
                        }}

                        containerStyle={{ marginBottom: 0 }}
                      />
                    </td>
                    <td className='border-0'>
                      <TextInputWhiteBackground
                        name={`code-${row.tempId}`}
                        type="number"
                        placeholder="Enter code"
                        label="Code"
                        register={register}
                        error={errors[`code-${row.tempId}`]}
                        validation={{
                          required: "Code is required"
                        }}
                        containerStyle={{ marginBottom: 0 }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 d-flex gap-2 flex-wrap">
            <p className='mb-0'>Add New <img src={AddIcon} role='button' onClick={addNewRow} alt='AddIcon' width={"24px"} height={"24px"} className='ms-2' /></p>
          </div>
        </div>
      </form>
    </>
  );
};

export default SalesForceContent;