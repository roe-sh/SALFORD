using Microsoft.AspNetCore.Mvc;
using Stripe.Checkout;

namespace SALFORD_APP_NCIT.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        [HttpPost("create-checkout-session")]
        public ActionResult CreateCheckoutSession([FromBody] PaymentRequest request)
        {
            Stripe.StripeConfiguration.ApiKey = "sk_test_XXXXXX"; // your Stripe secret key

            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string> { "card" },
                LineItems = new List<SessionLineItemOptions>
                {
                    new()
                    {
                        PriceData = new SessionLineItemPriceDataOptions
                        {
                            Currency = "usd",
                            UnitAmount = (long)(request.Amount * 100),
                            ProductData = new SessionLineItemPriceDataProductDataOptions
                            {
                                Name = request.CourseTitle,
                            },
                        },
                        Quantity = 1,
                    },
                },
                Mode = "payment",
                SuccessUrl = "http://localhost:19006/success",   // Expo web URL
                CancelUrl = "http://localhost:19006/cancel",
            };

            var service = new SessionService();
            var session = service.Create(options);

            return Ok(new { sessionUrl = session.Url });
        }
    }

    public class PaymentRequest
    {
        public string CourseTitle { get; set; } = "";
        public decimal Amount { get; set; }
    }
}
