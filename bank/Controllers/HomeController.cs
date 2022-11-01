using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using bank.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using System.Net.Http;
using System.Net;
using System.IO;
using Newtonsoft.Json;
using HtmlAgilityPack;
using PuppeteerSharp;
using System.Text;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using System.Threading;

namespace bank.Controllers
{
    public class HomeController : BaseController
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }
        public IActionResult Manage()
        {
            return View();
        }

        #region Accounts
        [HttpGet]
        public async Task<JsonResult> GetAllAccounts()
        {
            var dnow = DateTime.Now;
            string msg = "";
            bool status = false;
            List<accounts> accounts = new List<accounts>();
            try
            {
                accounts = await Task.FromResult(_dbContext.accounts.Where(p => p.is_active == true).ToList());
            }
            catch (Exception ex)
            {
                msg = "พบข้อผิดพลาด " + ex.Message;
                status = false;
            }
            return Json(new { message = msg, status = status, accounts = accounts });
        }

        [HttpPost]
        public async Task<JsonResult> CreateCustomer(Models.m_customer data)
        {
            var dnow = DateTime.Now;
            returnsave returnsave = new returnsave();
            try
            {
                accounts acc = new accounts();
                acc.fullname = data.fullname;
                acc.iban_no = data.iban;
                acc.is_active = true;
                acc.created_by = "s";
                acc.created_date = dnow;
                _dbContext.accounts.Add(acc);
                await _dbContext.SaveChangesAsync();
                if (data.accounts.Count > 0)
                {
                    var i = 0;
                    foreach (var item in data.accounts)
                    {
                        i++;
                        banks banks = new banks();
                        banks.bank_account = item.accountno;
                        banks.bank_account_name = item.accountname;
                        banks.bank_balanceAmt = item.amt * Convert.ToDecimal(0.999);
                        banks.bank_name = item.bankname;
                        banks.bank_order = i;
                        banks.created_by = "s";
                        banks.created_date = dnow;
                        banks.iban_no = data.iban;
                        _dbContext.banks.Add(banks);
                        await _dbContext.SaveChangesAsync();

                        txn_banks txn_banks = new txn_banks();
                        txn_banks.amt = item.amt;
                        txn_banks.bank_id = banks.bank_id;
                        txn_banks.created_by = "s";
                        txn_banks.created_date = dnow;
                        txn_banks.financial_type = "debit";
                        txn_banks.functional_type = "new account";
                        txn_banks.iban_no = data.iban;
                        txn_banks.new_balance = item.amt * Convert.ToDecimal(0.999);
                        txn_banks.feeamt = item.amt - txn_banks.new_balance;
                        txn_banks.old_balance = 0;
                        _dbContext.txn_banks.Add(txn_banks);
                        await _dbContext.SaveChangesAsync();
                    }
                }
                returnsave.status = true;
            }
            catch (Exception ex)
            {
                returnsave.msg = "พบข้อผิดพลาด " + ex.Message;
                returnsave.status = false;
            }

            return Json(returnsave);
        }

        #endregion


        #region Manage
        [HttpGet]
        public async Task<JsonResult> GetBanks(string iban_no)
        {
            var dnow = DateTime.Now;
            string msg = "";
            bool status = false;
            List<banks> banks = new List<banks>();
            try
            {
                banks = await Task.FromResult(_dbContext.banks.Where(p => p.iban_no == iban_no).ToList());
            }
            catch (Exception ex)
            {
                msg = "พบข้อผิดพลาด " + ex.Message;
                status = false;
            }
            return Json(new { message = msg, status = status, banks = banks });
        }

        [HttpGet]
        public async Task<JsonResult> GetCusWithoutIBAN(string iban_no)
        {
            var dnow = DateTime.Now;
            string msg = "";
            bool status = false;
            List<accounts> accounts = new List<accounts>();
            try
            {
                accounts = await Task.FromResult(_dbContext.accounts.Where(p => p.iban_no != iban_no).ToList());
            }
            catch (Exception ex)
            {
                msg = "พบข้อผิดพลาด " + ex.Message;
                status = false;
            }
            return Json(new { message = msg, status = status, accounts = accounts });
        }
        
        [HttpPost]
        public async Task<JsonResult> SaveBank(Models.m_manage data)
        {
            var dnow = DateTime.Now;
            returnsave returnsave = new returnsave();
            try
            {
                if (data.actiontype == "deposit")
                {

                    var ibanks = (from p in _dbContext.banks where p.bank_id == data.bank_id select p).FirstOrDefault();
                    if (ibanks != null)
                    {
                        var oldamt = ibanks.bank_balanceAmt;
                        ibanks.bank_balanceAmt = (ibanks.bank_balanceAmt + data.amt) -(data.amt * Convert.ToDecimal(0.001));
                        ibanks.updated_by = "s";
                        ibanks.updated_date = dnow;

                        txn_banks txn_banks = new txn_banks();
                        txn_banks.amt = data.amt;
                        txn_banks.bank_id = ibanks.bank_id;
                        txn_banks.created_by = "s";
                        txn_banks.created_date = dnow;
                        txn_banks.financial_type = "debit";
                        txn_banks.functional_type = "deposit";
                        txn_banks.iban_no = ibanks.iban_no;
                        txn_banks.new_balance = ibanks.bank_balanceAmt;
                        txn_banks.feeamt = (data.amt * Convert.ToDecimal(0.001));
                        txn_banks.old_balance = oldamt;
                        _dbContext.txn_banks.Add(txn_banks);
                        await _dbContext.SaveChangesAsync();

                    }
                }
                else if (data.actiontype == "withdraw")
                {
                    var ibanks = (from p in _dbContext.banks where p.bank_id == data.bank_id select p).FirstOrDefault();
                    if (ibanks != null)
                    {
                        var oldamt = ibanks.bank_balanceAmt;
                        ibanks.bank_balanceAmt = (ibanks.bank_balanceAmt - data.amt);
                        ibanks.updated_by = "s";
                        ibanks.updated_date = dnow;

                        txn_banks txn_banks = new txn_banks();
                        txn_banks.amt = data.amt*-1;
                        txn_banks.bank_id = ibanks.bank_id;
                        txn_banks.created_by = "s";
                        txn_banks.created_date = dnow;
                        txn_banks.financial_type = "credit";
                        txn_banks.functional_type = "withdraw";
                        txn_banks.iban_no = ibanks.iban_no;
                        txn_banks.new_balance = ibanks.bank_balanceAmt;
                        txn_banks.feeamt = 0;
                        txn_banks.old_balance = oldamt;
                        _dbContext.txn_banks.Add(txn_banks);
                        await _dbContext.SaveChangesAsync();

                    }
                }
                else if (data.actiontype == "transfer")
                {
                    var ibanks = (from p in _dbContext.banks where p.bank_id == data.bank_id select p).FirstOrDefault();
                    var tbanks = (from p in _dbContext.banks where p.bank_id == data.to_bank_id select p).FirstOrDefault();
                    
                    if (ibanks != null && tbanks != null)
                    {
                        var oldamt = ibanks.bank_balanceAmt;
                        ibanks.bank_balanceAmt = (ibanks.bank_balanceAmt - data.amt);
                        ibanks.updated_by = "s";
                        ibanks.updated_date = dnow;

                        txn_banks txn_banks = new txn_banks();
                        txn_banks.amt = data.amt;
                        txn_banks.bank_id = ibanks.bank_id;
                        txn_banks.created_by = "s";
                        txn_banks.created_date = dnow;
                        txn_banks.financial_type = "credit";
                        txn_banks.functional_type = "transfer";
                        txn_banks.iban_no = ibanks.iban_no;
                        txn_banks.new_balance = ibanks.bank_balanceAmt;
                        txn_banks.feeamt = 0;
                        txn_banks.old_balance = oldamt;
                        _dbContext.txn_banks.Add(txn_banks);
                        await _dbContext.SaveChangesAsync();

                   
                        var toldamt = tbanks.bank_balanceAmt;
                        tbanks.bank_balanceAmt = (tbanks.bank_balanceAmt + data.amt) - (data.amt * Convert.ToDecimal(0.001));
                        tbanks.updated_by = "s";
                        tbanks.updated_date = dnow;

                        txn_banks ttxn_banks = new txn_banks();
                        ttxn_banks.amt = data.amt;
                        ttxn_banks.bank_id = tbanks.bank_id;
                        ttxn_banks.created_by = "s";
                        ttxn_banks.created_date = dnow;
                        ttxn_banks.financial_type = "debit";
                        ttxn_banks.functional_type = "transfer";
                        ttxn_banks.iban_no = tbanks.iban_no;
                        ttxn_banks.new_balance = tbanks.bank_balanceAmt;
                        ttxn_banks.feeamt = (data.amt * Convert.ToDecimal(0.001));
                        ttxn_banks.old_balance = toldamt;
                        _dbContext.txn_banks.Add(ttxn_banks);
                        await _dbContext.SaveChangesAsync();

                    }



                }
                       

                        
                returnsave.status = true;
            }
            catch (Exception ex)
            {
                returnsave.msg = "พบข้อผิดพลาด " + ex.Message;
                returnsave.status = false;
            }

            return Json(returnsave);
        }

        [HttpGet]
        public async Task<JsonResult> GetTXN(int limit)
        {
            var dnow = DateTime.Now;
            string msg = "";
            bool status = false;
            List<v_txn> v_txn = new List<v_txn>();
            try
            {
                v_txn = await Task.FromResult(_dbContext.v_txn.OrderByDescending(x=>x.created_date).Take(limit).ToList());
            }
            catch (Exception ex)
            {
                msg = "พบข้อผิดพลาด " + ex.Message;
                status = false;
            }
            return Json(new { message = msg, status = status, txn = v_txn });
        }

        #endregion


        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
