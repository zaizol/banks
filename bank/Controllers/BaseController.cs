using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using bank.Models;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Microsoft.Extensions.Configuration;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Http.Features;

namespace bank.Controllers
{
    public class BaseController : Controller
    {
        protected bankDBContext _dbContext;

        protected BaseController()
          : this(new bankDBContext())
        {

        }

        protected BaseController(bankDBContext dbContext)
        {
            this._dbContext = dbContext;
        }
    }
}
