import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 lg:px-6 py-4">
          <Link href="/">
            <Button variant="ghost" className="mb-4" data-testid="back-to-home">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Privacy Policy</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 lg:px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <p className="text-muted-foreground leading-relaxed">
              This privacy policy sets out how the Company uses and protects any information that you give the Company when you use this website. The Company is committed to ensuring that your privacy is protected. Should we ask you to provide certain information by which you can be identified when using this website, then you can be assured that it will only be used in accordance with this privacy statement. The Company may change this policy from time to time by updating this page. You should check this page from time to time to ensure that you are happy with any changes. This policy is effective from 9/8/2025.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-foreground mb-4">GDPR Compliance</h2>
              <p className="text-muted-foreground leading-relaxed">
                This Site is intended solely for individuals residing outside of the territory of the European Union. By accessing and using this Site, you hereby agree and represent either (i) you are not a resident of the European Union, or (ii) if you are a resident of the European Union, that you hereby provide express consent to any personal information which may be collected from you by this Site, including, but not limited to, first name, last name, email address, phone number, physical address, IP address, and social media accounts and information. In no event shall any user cause this Site to collect personal information of any individual residing in the European Union without first obtaining the express consent of such individual.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-foreground mb-4">TCPA & Registration Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you choose to register on our website you hereby consent to receive auto-dialed and/or pre-recorded telemarketing calls and/or text messages on provided number from or on behalf of the Company or its participating lenders or affiliates; from the following telephone number: 302-343-5926, or from other numbers related to or affiliated with the company, which may use an automatic telephone dialing system, an artificial or prerecorded voice or text message. Standard message and data rates may apply. You acknowledge that you may receive emails or communications with mortgage-related information. You also certify that the provided number is your actual cell phone number and not that of anyone else. Furthermore, if your cell phone number changes, we ask for prompt notice of the new number.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Terms & Conditions</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing this website, you are agreeing to the terms of use.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-foreground mb-4">For Everyone, Especially Our Canadian Friends</h2>
              <p className="text-muted-foreground leading-relaxed">
                (CASL) If you wish to register on this website you are giving expressed consent for us to email, call, and text message you. If you do not wish for this type of communication please do not register.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-foreground mb-4">What We Collect</h2>
              <p className="text-muted-foreground leading-relaxed">
                We collect all information from our sign-up process. This information is disclosed during the sign-up process and can include name, email, city, state, gender, birthday, picture, website, and IP location.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-foreground mb-4">What We Do With The Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use this information to pass along to an agent to help you find a property. You will be contacted by email, text, or phone using this information. Upon registration, your information will be shared with our supporting lender.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Internal Record Keeping</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may use the information to improve our products and services. We may periodically send promotional emails about new products, special offers, or other information which we think you may find interesting using the email address which you have provided. From time to time, we may also use your information to contact you for market research purposes. We may contact you by email, phone, fax, or mail. We may use the information to customize the website according to your interests. We may provide your information to our third-party partners for marketing or promotional purposes. We will never sell your information.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We are committed to ensuring that your information is secure. In order to prevent unauthorized access or disclosure, we have put in place suitable physical, electronic, and managerial procedures to safeguard and secure the information we collect online.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-foreground mb-4">How We Use Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                A cookie is a small file that asks permission to be placed on your computer's hard drive. Once you agree, the file is added and the cookie helps analyze web traffic or lets you know when you visit a particular site. Cookies allow web applications to respond to you as an individual. The web application can tailor its operations to your needs, likes, and dislikes by gathering and remembering information about your preferences. We use traffic log cookies to identify which pages are being used. This helps us analyze data about web page traffic and improve our website in order to tailor it to customer needs. We only use this information for statistical analysis purposes and then the data is removed from the system. Overall, cookies help us provide you with a better website, by enabling us to monitor which pages you find useful and which you do not. A cookie in no way gives us access to your computer or any information about you, other than the data you choose to share with us. You can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. This may prevent you from taking full advantage of the website.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Links to Other Websites</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our website may contain links to enable you to visit other websites of interest easily. However, once you have used these links to leave our site, you should note that we do not have any control over that other website. Therefore, we cannot be responsible for the protection and privacy of any information which you provide whilst visiting such sites and such sites are not governed by this privacy statement. You should exercise caution and look at the privacy statement applicable to the website in question.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Controlling Your Personal Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you wish to opt-out of contact you can click on the unsubscribe link at the bottom of any email correspondence. If you wish to opt-out of phone calls please email support@insiderealestate.com.
              </p>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-foreground mb-4">California Consumer Privacy Policy Compliance</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We adopt this section to comply with the California Consumer Privacy Act of 2018 (CCPA) and any terms defined in the CCPA have the same meaning when used in this section.
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Collection of Personal Information</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We collect information that identifies, relates to, describes, references is reasonably capable of being associated with, or could reasonably be linked, directly or indirectly, with a particular consumer, household, or device ("personal information"). However, personal information does not include publicly available information from government records or de-identified or aggregated consumer information.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-2">
                    In particular, within the last twelve months we have collected the following categories of personal information: (a) identifiers; (b) personal information categories listed in the California Customer Records statute; (c) commercial information; (d) internet or other similar network activity; and (e) inferences drawn from other personal information. We gather these categories of personal information directly from you when you register to use our services and indirectly from you as you interact with our website. However, please note, that you may visit our website anonymously.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Use of Personal Information</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We may use or disclose the personal information we collect for one or more of the following purposes: to fulfill or meet the reason you provided the information; to provide support, personalize, and develop our website, products, and services; to create maintain, customize and secure your account with us; to process your requests, purchases, transactions, and payments and prevent transactional fraud; to provide you with support and to respond to inquiries; to personalize your website experience and to deliver content and product and service offerings relevant to your interests; for testing, research, analysis, and product development; to respond to law enforcement requests and as required by applicable law; and as described to you when collecting your personal information or as otherwise set forth in the CCPA.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Your Rights and Choices</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To exercise your access, data portability, and deletion rights, please submit a verifiable consumer request to us by either calling us at (302) 218-0130 or e-mailing us at Kevin.Hensley@remax.net. We use our best efforts to respond to verifiable consumer requests within forty-five days of receipt.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link href="/">
              <Button className="px-8 py-3" data-testid="return-home">
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}