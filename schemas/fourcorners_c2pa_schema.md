| **key**                              	    | **type** | **description**                                                   |
|-------------------------------------------|----------|-------------------------------------------------------------------|
| `fourcorners:authorship`  		            | Object 	 | Object containing all `fourcorners:authorship*` values            |
| `fourcorners:authorshipCaption`           | String   | 																																	 |
| `fourcorners:authorshipCredit`            | String   | 																																	 |
| `fourcorners:authorshipLicense`           | Object   | Object containing all `fourcorners:authorshipLicense*` values     |
| `fourcorners:authorshipLicenseType`       | String   | Accepts `copyright`, `commons`, or `false`                        |
| `fourcorners:authorshipLicenseYear`       | Number   | Only if `fourcorners:authorshipLicenseType` is set to `copyright` |
| `fourcorners:authorshipLicenseHolder`     | String   | Only if `fourcorners:authorshipLicenseType` is set to `copyright` |
| `fourcorners:authorshipLicenseLabel`      | String   | Only if `fourcorners:authorshipLicenseType` is set to `commons`   |
| `fourcorners:authorshipLicenseDesc`       | String   | Only if `fourcorners:authorshipLicenseType` is set to `commons`   |
| `fourcorners:authorshipLicenseUrl`        | String   | Only if `fourcorners:authorshipLicenseType` is set to `commons`   |
| `fourcorners:authorshipEthics`            | Object   | Object containing all `fourcorners:authorshipEthics*` values      |
| `fourcorners:authorshipEthicsLabel`       | String   | Only if prewritten code of ethics is selected                     |
| `fourcorners:authorshipEthicsDescription` | String   |                                                                   |
| `fourcorners:authorshipBio`               | String   |                                                                   |
| `fourcorners:authorshipWebsite`           | String   |                                                                   |
| `fourcorners:authorshipContact`           | Object   | Object containing all `fourcorners:authorshipContact*` values     |
| `fourcorners:authorshipContactInfo`       | String   |                                                                   |
| `fourcorners:authorshipContactRights`     | String   |                                                                   |
| `fourcorners:backstory`               		| Object 	 | Object containing all `fourcorners:backstory*` values             |
| `fourcorners:backstoryText`               | String   |                                                                   |
| `fourcorners:backstoryMedia`              | Array    | Array containing objects of `fourcorners:backstoryMedia*` values  |
| `fourcorners:backstoryMediaSource`        | String   | Accepts only `soundcloud`																				 |
| `fourcorners:backstoryMediaUrl`           | String   | Should validate URL                                               |
| `fourcorners:backstoryMediaCaption`       | String   |                                                                   |
| `fourcorners:backstoryMediaCredit`        | String   |                                                                   |
| `fourcorners:imagery`                 		| Object 	 | Object containing all `fourcorners:imagery*` values    				   |
| `fourcorners:imageryMedia`                | Array    | Array containing objects of `fourcorners:imageryMedia*` values    |
| `fourcorners:imageryMediaSource`          | String   | Accepts `image`, `youtube`, `vimeo`, or `instagram`       				 |
| `fourcorners:imageryMediaUrl`             | String   | Should validate URL                                               |
| `fourcorners:imageryMediaCaption`         | String   |                                                                   |
| `fourcorners:imageryMediaCredit`          | String   |                                                                   |
| `fourcorners:links`                  			| Object 	 | Object containing all `fourcorners:links*` values     						 |
| `fourcorners:linksLinks`                  | Array    | Array containing objects of `fourcorners:linksLinks*` values      |
| `fourcorners:linksSource`                 | String   | Accepts only `link`																							 |
| `fourcorners:linksTitle`                  | String   |                                                                   |
| `fourcorners:linksUrl`                    | String   | Should validate URL     			                                     |