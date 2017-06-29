const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const promisify = require('es6-promisify');
const postmark = require("postmark");
const client = new postmark.Client(process.env.POSTMARK_API);

const generateHTML = (filename, options = {}) => {
  // convert pug files into regular HTML
  const html = pug.renderFile(`${__dirname}/../views/email/${filename}.pug`, options);
  // put CSS styles inline so that the email looks right in all clients
  const inlined = juice(html);
  return inlined;
};

exports.send = async (options) => {
  const html = generateHTML(options.filename, options);
  const text = htmlToText.fromString(html);
  const mailOptions = {
    "From": "Micah Bales <micah@micahbales.com>",
    "To": options.user.email,
    "Subject": options.subject,
    "HtmlBody": html,
    "TextBody": text
  }
  const sendEmail = promisify(client.sendEmail, client);

  return sendEmail(mailOptions);
};
