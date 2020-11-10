using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace SalesWebApi.Infrasctructure
{
    public class JsonStringResult : IHttpActionResult
    {

        string _value = string.Empty;
        HttpRequestMessage _request;

        public JsonStringResult(string value, HttpRequestMessage request)
        {
            _value = value ?? String.Empty;
            _request = request;
        }
        public Task<HttpResponseMessage> ExecuteAsync(CancellationToken cancellationToken)
        {
            var response = _request.CreateResponse(HttpStatusCode.OK);
            response.Content = new StringContent(_value);
            response.RequestMessage = _request;
            response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
            return Task.FromResult(response);
        }
    }

}