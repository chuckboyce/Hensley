import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function TermsOfUse() {
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
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Terms of Use</h1>
          <p className="text-lg text-muted-foreground mt-2">RE/MAX Eagle Realty</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 lg:px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <p className="text-muted-foreground leading-relaxed">
              <strong>PLEASE READ THE TERMS AND CONDITIONS OF USE CAREFULLY BEFORE USING THIS SITE.</strong> This site is free to use by our visitors. And by using this site, you the user are agreeing to comply with and be bound by the following terms of use. After reviewing the following terms and conditions thoroughly, if you do not agree to the terms and conditions, please do not use this site.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-foreground mb-4">TCPA & Registration Terms</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you choose to register on our website you hereby consent to receive autodialed and/or pre-recorded telemarketing calls and/or text messages on provided number from or on behalf of RE/MAX Eagle Realty or it's participating lenders or affiliates; from the following telephone number: 302-343-5926, or from other numbers related to or affiliated with the company, which may use an automatic telephone dialing system, an artificial or prerecorded voice or text message. Standard message and data rates may apply. You acknowledge that you may receive emails or communications with mortgage-related information. You also certify that the provided number is your actual cell phone number and not that of anyone else. Furthermore, if your cell phone number changes, we ask for prompt notice of the new number.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                If you wish to opt out of phone calls, text or emails please click this link: <a href="https://kevin-hensley.remax.com/settings.php?sub=0" className="text-primary hover:underline">https://kevin-hensley.remax.com/settings.php?sub=0</a>
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Acceptance of Agreement</h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree to the terms and conditions outlined in this Terms and Conditions of use Agreement (Agreement) with respect to our site (the Site). This Agreement constitutes the entire and only agreement between us and you, and supersedes all prior or contemporaneous agreements, representations, warranties and understandings with respect to the Site, the content, free product samples or freebie offers or services provided by or listed on the Site, and the subject matter of this Agreement. This Agreement may be amended by us at any time and at any frequency without specific notice to you. The latest Agreement will be posted on the Site, and you should review this Agreement prior to using the Site.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Copyright</h2>
              <p className="text-muted-foreground leading-relaxed">
                The content, organization, graphics, design, and other matters related to the Site are protected under applicable copyrights and other proprietary laws, including but not limited to intellectual property laws. The copying, reproduction, use, modification or publication by you of any such matters or any part of the Site is strictly prohibited, without our express prior written permission.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Deleting and Modification</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right in our sole discretion, without any obligation and without any notice requirement to you, to edit or delete any documents, information or other content appearing on the Site, including this Agreement. You agree to indemnify, defend and hold us, our officers, our share holders, our partners, attorneys and employees harmless from any and all liability, loss, damages, claim and expense, including reasonable attorney's fees, related to your violation of this Agreement or use of the Site.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Disclaimer</h2>
              <p className="text-muted-foreground leading-relaxed">
                THE CONTENT, SERVICES, FREE PRODUCT SAMPLES AND FREEBIE OFFERS FROM OR LISTED THROUGH THE SITE ARE PROVIDED "AS-IS," "AS AVAILABLE," AND ALL WARRANTIES, EXPRESS OR IMPLIED, ARE DISCLAIMED, INCLUDING BUT NOT LIMITED TO THE DISCLAIMER OF ANY IMPLIED WARRANTIES OF TITLE, NON-INFRINGEMENT, MERCHANTABILITY, QUALITY AND FITNESS FOR A PARTICULAR PURPOSE, WITH RESPECT TO THIS SITE AND ANY WEBSITE WITH WHICH IT IS LINKED. THE INFORMATION AND SERVICES MAY CONTAIN BUGS, ERRORS, PROBLEMS OR OTHER LIMITATIONS. WE HAVE NO LIABILITY WHATSOEVER FOR YOUR USE OF ANY INFORMATION OR SERVICE. THE INFORMATION AND ALL OTHER MATERIALS ON THE SITE ARE PROVIDED FOR GENERAL INFORMATION PURPOSES ONLY AND DO NOT CONSTITUTE PROFESSIONAL ADVICE. IT IS YOUR RESPONSIBILITY TO EVALUATE THE ACCURACY AND COMPLETENESS OF ALL INFORMATION AVAILABLE ON THIS SITE OR ANY WEBSITE WITH WHICH IT IS LINKED.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Limits</h2>
              <p className="text-muted-foreground leading-relaxed">
                All responsibility or liability for any damages caused by viruses contained within the electronic file containing the form or document is disclaimed. We will not be liable to you for any incidental, special or consequential damages of any kind that may result from use of or inability to use the site.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Third-Party Website</h2>
              <p className="text-muted-foreground leading-relaxed">
                All rules, terms and conditions, other policies (including privacy policies) and operating procedures of third-party linked websites will apply to you while on such websites. We are not responsible for the content, accuracy or opinions express in such Websites, and such Websites are not investigated, monitored or checked for accuracy or completeness by us. Inclusion of any linked Website on our Site does not imply approval or endorsement of the linked Website by us. This Site and the third-party linked websites are independent entities and neither party has authority to make any representations or commitments on behalf of the other. If you decide to leave our Site and access these third-party linked sites, you do so at your own risk.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Third-Party Products and Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                The only 3rd party that may receive your information is our mortgage partner. They will only receive your information if you select you wish a mortgage pre-approval. Then and only then will you receive a call from our mortgage affiliate.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Submissions</h2>
              <p className="text-muted-foreground leading-relaxed">
                All suggestions, ideas, notes, concepts, blog posts, and other information you may send to us (collectively, "Submissions") shall be deemed and shall remain our sole property and shall not be subject to any obligation of confidence on our part. Without limiting the foregoing, we shall be deemed to own all known and hereafter existing rights of every kind and nature regarding the Submissions and shall be entitled to unrestricted use of the Submissions for any purpose, without compensation to the provider of the Submissions.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-foreground mb-4">For Everyone, Especially Our Canadian Friends</h2>
              <p className="text-muted-foreground leading-relaxed">
                By clicking Register, you understand that real estate professionals and/or lenders may call/text you regarding your inquiry, and may involve automated means and pre-recorded/artificial voices. Registration is not a condition of buying any property, goods or services. Messages/data rates may apply. Consent can be withdrawn at any time by clicking the "unsubscribe" link contained in the email.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-foreground mb-4">General</h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree that all actions or proceedings arising directly or indirectly out of this agreement, or your use of the site or any sample products, freebie offers or services obtained by you through such use, shall be litigated in the District Court of Utah. You are expressly submitting and consenting in advance to such jurisdiction in any action or proceeding in any of such court, and are waiving any claim that the District Court of Utah is an inconvenient forum or an improper forum based on lack of venue. This site is controlled by InsideRE, LLC. in the State of Utah, USA. As such, the laws of Utah will govern the terms and conditions contained in this Agreement and elsewhere throughout the Site, without giving effect to any principles of conflicts of laws.
              </p>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-foreground mb-4">GDPR Compliance</h2>
              <p className="text-muted-foreground leading-relaxed">
                This Site is intended solely for individuals residing outside of the territory of the European Union. By accessing and using this Site, you hereby agree and represent either (i) you are not a resident of the European Union, or (ii) if you are a resident of the European Union, that you hereby provide express consent to any personal information which may be collected from you by this Site, including, but not limited to, first name, last name, email address, phone number, physical address, IP address, and social media accounts and information. In no event shall any user cause this Site to collect personal information of any individual residing in the European Union without first obtaining the express consent of such individual.
              </p>
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