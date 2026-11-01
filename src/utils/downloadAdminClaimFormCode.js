import adminClaimFormPageSource from '../Pages/ClaimFormFormPageAdmin.jsx?raw';
import adminClaimFormApiSource from '../services/claimFormAdmin.js?raw';

const ADMIN_CLAIM_FORM_LOGIC = `ADMIN CLAIM FORM LOGIC
=======================
This file is the admin-only claim form implementation used at /claim-form
when role_id === 1 (ClaimFormFormPageAdmin).

FLOW
----
1. Admin enters SWI Dealer ID. After 1 second debounce, company name is
   loaded from POST /admin/get-dealer-user.
2. Type of Claim (bid | fleet) loads manufacturers from
   GET /admin/get-manufacturer?rebate_type={type}.
   Admin claim form keeps only RedMax products.
3. Manufacturer + dealer ID load models from
   GET /admin/get-models-claims/{productId}/{dealerId}.
4. Changing dealer ID clears the selected manufacturer so models reload.
5. Selecting a model loads serials from
   GET /admin/get-serials-claims/{modelNumber}/{dealerId}.
   Serials already used on other rows are hidden.
6. Model + serial are verified with
   POST /admin/verify-claim-serial-number
   { model_number, serial_number, dealer_id }.
   Response fills model_serial, part_number, points, msrp.
7. Sell price is computed as: MSRP - Discount Rate.
8. Submit posts multipart data to POST /admin/submit-claim.

PRICE / REBATE LOGIC (calculatePrice)
-------------------------------------
discountDollar = msrp - sellPrice
discountPercentage = (1 - sellPrice / msrp) * 100

If manufacturer is Little Wonder, Classen, or Mantis:
  < 10%   -> dealerRebate = 0
  10-15%  -> dealerRebate = discountPercentage * 7
  15-20%  -> dealerRebate = discountPercentage * 8.5
  >= 20%  -> dealerRebate = discountPercentage * 10

Otherwise (including RedMax):
  10-20%  -> dealerRebate = discountDollar / 2
  >= 20%  -> dealerRebate = msrp * 0.1
  < 10%   -> dealerRebate = discountDollar

Total on submit is the sum of all row dealerRebate values (getTotalMsrp).

SOURCE FILES
------------
The rest of this download is the live admin claim form page and API service.
`;

const downloadBlob = (content, filename) => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadAdminClaimFormCode = () => {
  const content = [
    ADMIN_CLAIM_FORM_LOGIC,
    '',
    '========== src/Pages/ClaimFormFormPageAdmin.jsx ==========',
    adminClaimFormPageSource,
    '',
    '========== src/services/claimFormAdmin.js ==========',
    adminClaimFormApiSource,
  ].join('\n');

  downloadBlob(content, 'AdminClaimFormCode.txt');
};
