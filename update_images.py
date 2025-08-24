#!/usr/bin/env python3

# Mapping of original hashes to new local filenames
image_mapping = {
    "b8db2f1423625c854c004a9be709d05c736c0ec1.png": "frame-1-user-scenario.png",
    "cae42ba90e435a9e1647c55855571d84886a1254.png": "frame-2-current-ux-flow.png",
    "2828f5f545a4b0e32c5d27ffd2fd842fe8537c79.png": "frame-3-customer-voice.png",
    "dc0830f585c896c557be98738813f64bbd37172e.png": "frame-3-interface-analysis-1.png",
    "09e68eefba68bea98a6fc14582990fe37f3e8539.png": "frame-3-interface-analysis-2.png",
    "3d33c708ec9731ba80852d2e55764a309a600089.png": "frame-3-interface-analysis-3.png",
    "ca9c7bc91cb192ac3233be794afe045b5960ffc4.png": "frame-4-stakeholder-alignment.png",
    "20204cadf7b294b3776af097ad9dece573e9dff4.png": "frame-5-design-thinking.png",
    "27a719e0eb19f3b44f121ddcdb5be410f7ccf720.png": "frame-5-persona-rahul.png",
    "4f3f12337b2410efab103ab15b62f1e236fa07e2.png": "frame-6-sam-interface.png",
    "3c8983fdb552b309ecb0ad8c95dd3375c67957a9.png": "frame-6-john-interface.png",
    "89303c464aa6ea3d6c022cbf3b86923b3724e6c9.png": "frame-7-mobile-screen-1.png",
    "1b51bd1363e9d76b4f34ef07d26ffa4e876ae9c9.png": "frame-7-mobile-screen-2.png",
    "f4019889255a65402bd6aae2068e21429ddc34c8.png": "frame-7-mobile-screen-3.png",
    "9a334b109a4279e4a9f38afc43a12ee41874b682.png": "frame-7-mobile-screen-4.png",
    "1b43c21c84b9d194c7508de1f177e5d07e1c8286.png": "frame-8-design-screen-1.png",
    "a2ddbe0e44e4fe3ef95dcce95929d1de7c0d2467.png": "frame-8-design-screen-2.png",
    "413d8be8c8af5b3486c327b5b6dbc035308c7f6b.png": "frame-8-design-screen-3.png",
    "4981022f3e02c2d5735ea8eebf2b9d470d5c4f10.png": "frame-8-design-screen-4.png",
    "e80326bfb61e1fe02951b707800cf4ab6b1c6b61.png": "frame-8-design-screen-5.png",
    "10bde6f71218c525b3b3b59f5fe9152056842124.png": "frame-8-design-screen-6.png",
    "69c9edd6104d95e9ed4797c8be1cb333057920d7.png": "frame-9-pending-state.png",
    "ab295fdec627d0ea7249f805b967031b4f2dfe2e.png": "frame-9-failed-state.png",
    "00402b0d509e500dd0cec41d648cf05a6556c1e7.png": "frame-10-cross-product-1.png",
    "30e25b957275db0c22feb1cf95e2d1246b845ec3.png": "frame-10-cross-product-2.png",
    "be8206f82b432ccf34bace30bc9ba44d6dd8da9a.png": "frame-10-cross-product-3.png",
    "9603ef2e1d1a95ec754c1df55d415195f0831481.png": "frame-11-cashback-wireframe.png",
    "41c22bbe123d7efb1cf314ccfb9578fa4fb9b3f4.png": "frame-11-offers-wireframe.png",
    "55a5929bc688455b20b72c9966a66d42ebda6f30.png": "frame-11-scratch-cards-wireframe.png",
    "3679716e6b4addc82c3a070a13dcc1f1b4c029a2.png": "frame-11-wireframes-overview.png",
    "803af3bf61dc579ea6505eb7a478a38e9a2c6416.png": "frame-12-processing-screen-1.png",
    "2f2bbf4c76ed92954c2b80bb942c661718b772e9.png": "frame-12-processing-screen-2.png",
    "98bd94d98c2e01479191ab1948db7709536aaee8.png": "frame-12-desktop-thank-you.png",
    "0d8996c5c907b4bce52ccb92492416b306a8619b.png": "frame-13-ux-writing-table.png",
    "56fa1ac7d6676df5515e2a70107a829c0174ece5.png": "frame-13-ux-writing-workflow.png",
    "8e458666002eefe5da80f4e5bf5a6b43aa87a934.png": "frame-14-success-metrics.png",
    # Additional images mapped to misc files
    "fd5e8605bcd7e528f78f6b4a3855e5ccccb17e04.png": "misc-1.png",
    "37a95c402b3410310469a5934aec7f0db09832f2.png": "misc-2.png", 
    "f400fe8bd932bb055968da390dcf2782bbc2280d.png": "misc-3.png",
    "540a48eb7a6558b42c5d0fc912a9bc5542ce86ec.png": "misc-4.png",
    "64ab402b5485b93f65117ccbb4d68fb5eda14cad.png": "misc-5.png",
    "dbaaef01a555b30a00df65e608d6e3929fa192e4.png": "misc-6.png",
    "27524a891245f434d20098bea4721e2a484a846a.png": "misc-7.png",
    "0604ed373894391ff240f88b6e7f36e225e38ee3.png": "misc-8.png",
    "a2894fdb2597e7e7ae77eb9e512584922f19b0ad.png": "misc-9.png",
    "833710acc65e0ec9815da25bcfbf9bd5f2fb418c.png": "misc-10.png",
    "89ca27d155b0ed9007d05aed63e8ce04ecce9789.png": "misc-11.png",
    "16f85b08d903d632e0dce8cadcd21bab2b024e2e.png": "misc-12.png"
}

# Read the HTML file
with open('/Users/apex/Desktop/Meghna/meghna-portfolio/AmazonPayUXResearch.html', 'r') as file:
    content = file.read()

# Replace all localhost URLs with local image paths
for hash_filename, local_filename in image_mapping.items():
    old_url = f"http://localhost:3845/assets/{hash_filename}"
    new_url = f"images/amazon-pay-ux-research/{local_filename}"
    content = content.replace(old_url, new_url)

# Write the updated content back to the file
with open('/Users/apex/Desktop/Meghna/meghna-portfolio/AmazonPayUXResearch.html', 'w') as file:
    file.write(content)

print("Successfully updated all image references to local files!")
