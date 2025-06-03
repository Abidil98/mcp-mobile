/**
 * Shopmium MCP Wrapper
 * 
 * This script provides easy-to-use functions for controlling the Shopmium app
 * using the mobile MCP server.
 */

// Import required modules
const { spawn } = require('child_process');
const readline = require('readline');

// App package name
const SHOPMIUM_PACKAGE = 'com.shopmium';

// UI Element coordinates (from shopmium_ui_elements.md)
const UI_ELEMENTS = {
  // Bottom navigation buttons
  bottomNav: {
    offers: { x: 67, y: 2300 },
    categories: { x: 252, y: 2300 },
    reimburse: { x: 460, y: 2300 },
    loyaltyCards: { x: 686, y: 2300 },
    purchases: { x: 927, y: 2300 }
  },
  // Top navigation tabs
  topNav: {
    home: { x: 25, y: 254 },
    shopmiumParty: { x: 210, y: 254 },
    newItems: { x: 549, y: 254 },
    laundryCare: { x: 811, y: 254 }
  }
};

/**
 * Execute an MCP command and return the result
 * @param {string} serverName - MCP server name
 * @param {string} toolName - Tool name
 * @param {object} args - Tool arguments
 * @returns {Promise<object>} - Command result
 */
async function executeMcpCommand(serverName, toolName, args) {
  return new Promise((resolve, reject) => {
    const command = `npx -y @mobilenext/mobile-mcp@latest ${toolName} '${JSON.stringify(args)}'`;
    
    console.log(`Executing: ${command}`);
    
    const process = spawn('cmd.exe', ['/c', command], { shell: true });
    
    let output = '';
    
    process.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    process.stderr.on('data', (data) => {
      console.error(`Error: ${data}`);
    });
    
    process.on('close', (code) => {
      if (code === 0) {
        try {
          const result = JSON.parse(output);
          resolve(result);
        } catch (e) {
          resolve(output);
        }
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });
  });
}

/**
 * Shopmium app controller class
 */
class ShopmiumController {
  /**
   * Initialize the controller
   * @param {string} deviceId - Android device ID
   */
  constructor(deviceId = 'emulator-5554') {
    this.deviceId = deviceId;
    this.serverName = 'github.com/mobile-next/mobile-mcp';
  }

  /**
   * Select the device to use
   * @returns {Promise<string>} - Result message
   */
  async selectDevice() {
    return executeMcpCommand(this.serverName, 'mobile_use_device', {
      device: this.deviceId,
      deviceType: 'android'
    });
  }

  /**
   * Launch the Shopmium app
   * @returns {Promise<string>} - Result message
   */
  async launchApp() {
    return executeMcpCommand(this.serverName, 'mobile_launch_app', {
      packageName: SHOPMIUM_PACKAGE
    });
  }

  /**
   * Take a screenshot of the current screen
   * @returns {Promise<string>} - Screenshot data
   */
  async takeScreenshot() {
    return executeMcpCommand(this.serverName, 'mobile_take_screenshot', {});
  }

  /**
   * List elements on the current screen
   * @returns {Promise<Array>} - List of UI elements
   */
  async listElements() {
    return executeMcpCommand(this.serverName, 'mobile_list_elements_on_screen', {});
  }

  /**
   * Click on a specific position on the screen
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @returns {Promise<string>} - Result message
   */
  async clickAt(x, y) {
    return executeMcpCommand(this.serverName, 'mobile_click_on_screen_at_coordinates', {
      x, y
    });
  }

  /**
   * Navigate to the Offers tab
   * @returns {Promise<string>} - Result message
   */
  async goToOffers() {
    return this.clickAt(UI_ELEMENTS.bottomNav.offers.x, UI_ELEMENTS.bottomNav.offers.y);
  }

  /**
   * Navigate to the Categories tab
   * @returns {Promise<string>} - Result message
   */
  async goToCategories() {
    return this.clickAt(UI_ELEMENTS.bottomNav.categories.x, UI_ELEMENTS.bottomNav.categories.y);
  }

  /**
   * Navigate to the Reimburse tab
   * @returns {Promise<string>} - Result message
   */
  async goToReimburse() {
    return this.clickAt(UI_ELEMENTS.bottomNav.reimburse.x, UI_ELEMENTS.bottomNav.reimburse.y);
  }

  /**
   * Navigate to the Loyalty Cards tab
   * @returns {Promise<string>} - Result message
   */
  async goToLoyaltyCards() {
    return this.clickAt(UI_ELEMENTS.bottomNav.loyaltyCards.x, UI_ELEMENTS.bottomNav.loyaltyCards.y);
  }

  /**
   * Navigate to the Purchases tab
   * @returns {Promise<string>} - Result message
   */
  async goToPurchases() {
    return this.clickAt(UI_ELEMENTS.bottomNav.purchases.x, UI_ELEMENTS.bottomNav.purchases.y);
  }

  /**
   * Navigate to the Home tab in the top navigation
   * @returns {Promise<string>} - Result message
   */
  async goToHomeTab() {
    return this.clickAt(UI_ELEMENTS.topNav.home.x, UI_ELEMENTS.topNav.home.y);
  }

  /**
   * Navigate to the Shopmium Party tab in the top navigation
   * @returns {Promise<string>} - Result message
   */
  async goToShopmiumPartyTab() {
    return this.clickAt(UI_ELEMENTS.topNav.shopmiumParty.x, UI_ELEMENTS.topNav.shopmiumParty.y);
  }

  /**
   * Navigate to the New Items tab in the top navigation
   * @returns {Promise<string>} - Result message
   */
  async goToNewItemsTab() {
    return this.clickAt(UI_ELEMENTS.topNav.newItems.x, UI_ELEMENTS.topNav.newItems.y);
  }

  /**
   * Navigate to the Laundry Care tab in the top navigation
   * @returns {Promise<string>} - Result message
   */
  async goToLaundryCareTab() {
    return this.clickAt(UI_ELEMENTS.topNav.laundryCare.x, UI_ELEMENTS.topNav.laundryCare.y);
  }

  /**
   * Swipe up on the screen
   * @returns {Promise<string>} - Result message
   */
  async swipeUp() {
    return executeMcpCommand(this.serverName, 'swipe_on_screen', {
      direction: 'up'
    });
  }

  /**
   * Swipe down on the screen
   * @returns {Promise<string>} - Result message
   */
  async swipeDown() {
    return executeMcpCommand(this.serverName, 'swipe_on_screen', {
      direction: 'down'
    });
  }

  /**
   * Type text into the focused element
   * @param {string} text - Text to type
   * @param {boolean} submit - Whether to submit the text
   * @returns {Promise<string>} - Result message
   */
  async typeText(text, submit = false) {
    return executeMcpCommand(this.serverName, 'mobile_type_keys', {
      text,
      submit
    });
  }
}

// Export the controller
module.exports = ShopmiumController;

// Example usage
async function example() {
  const controller = new ShopmiumController();
  
  // Select device
  await controller.selectDevice();
  
  // Launch app
  await controller.launchApp();
  
  // Navigate to Offers tab
  await controller.goToOffers();
  
  // Take a screenshot
  await controller.takeScreenshot();
}

// Run the example if this script is executed directly
if (require.main === module) {
  example().catch(console.error);
}