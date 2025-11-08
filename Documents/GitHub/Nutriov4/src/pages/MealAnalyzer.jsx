import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, Barcode } from 'lucide-react';
import { addMeal, addFavourite } from '../store/mealsSlice';
import { addXp, checkAchievements } from '../store/achievementsSlice';
import { incrementMealCount, incrementScanCount } from '../store/userSlice';
import { isPremium } from '../utils/subscription';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Camera as CapCamera } from '@capacitor/camera';
import { CameraResultType, CameraSource } from '@capacitor/camera';
import './MealAnalyzer.css';

const MealAnalyzer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.user);
  const meals = useSelector(state => state.meals);
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mealData, setMealData] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  });
  
  const [scanning, setScanning] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMealData(prev => ({ ...prev, [name]: value }));
  };

  // Photo Upload - Premium Feature
  const handlePhotoUpload = async (source) => {
    if (!isPremium()) {
      setShowPremiumModal(true);
      return;
    }

    try {
      const image = await CapCamera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: source
      });

      setSelectedImage(image.dataUrl);
      analyzeMealPhoto(image.dataUrl);
    } catch (error) {
      console.error('Photo error:', error);
      alert('Failed to get photo');
    }
  };

  const analyzeMealPhoto = (imageData) => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis (in production, send to AI service)
    setTimeout(() => {
      const mockResult = {
        name: 'Grilled Chicken Salad',
        calories: 385,
        protein: 42,
        carbs: 18,
        fat: 16
      };
      
      setMealData({
        name: mockResult.name,
        calories: mockResult.calories.toString(),
        protein: mockResult.protein.toString(),
        carbs: mockResult.carbs.toString(),
        fat: mockResult.fat.toString()
      });
      setIsAnalyzing(false);
      alert('Meal analyzed! Review and adjust the results below.');
    }, 2000);
  };

  // Barcode Scanner - Free Feature
  const handleBarcodeScanner = async () => {
    try {
      setScanning(true);
      
      const status = await BarcodeScanner.checkPermission({ force: true });
      
      if (!status.granted) {
        alert('Camera permission is required to scan barcodes');
        setScanning(false);
        return;
      }

      document.body.classList.add('scanner-active');
      const result = await BarcodeScanner.startScan();
      
      document.body.classList.remove('scanner-active');
      setScanning(false);

      if (result.hasContent) {
        dispatch(incrementScanCount());
        alert(`Barcode scanned: ${result.content}\n\nIn production, this would fetch product nutritional data.`);
        
        // Mock data for demonstration
        setMealData({
          name: 'Scanned Product',
          calories: '250',
          protein: '20',
          carbs: '30',
          fat: '8'
        });
      }
    } catch (error) {
      console.error('Scanner error:', error);
      document.body.classList.remove('scanner-active');
      setScanning(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!mealData.name || !mealData.calories) {
      alert('Please enter at least meal name and calories');
      return;
    }

    const meal = {
      name: mealData.name,
      calories: parseFloat(mealData.calories) || 0,
      protein: parseFloat(mealData.protein) || 0,
      carbs: parseFloat(mealData.carbs) || 0,
      fat: parseFloat(mealData.fat) || 0
    };

    dispatch(addMeal(meal));
    dispatch(incrementMealCount());
    dispatch(addXp(10));
    
    dispatch(checkAchievements({
      totalMeals: user.stats.totalMeals + 1,
      currentStreak: user.stats.currentStreak,
      favouritesCount: meals.favourites.length,
      scansCompleted: user.stats.scansCompleted
    }));

    // Reset form
    setMealData({
      name: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: ''
    });
    setSelectedImage(null);

    alert('Meal logged successfully! +10 XP');
  };

  const handleSaveAsFavourite = () => {
    if (!mealData.name || !mealData.calories) {
      alert('Please enter meal details first');
      return;
    }

    const favourite = {
      name: mealData.name,
      calories: parseFloat(mealData.calories) || 0,
      protein: parseFloat(mealData.protein) || 0,
      carbs: parseFloat(mealData.carbs) || 0,
      fat: parseFloat(mealData.fat) || 0
    };

    dispatch(addFavourite(favourite));
    alert('Saved to favourites!');
  };

  return (
    <div className="meal-analyzer">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Analyze Meal</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Scan, photograph, or manually log your meals</p>

      {/* Photo Upload Section - Premium */}
      <div className="mb-6 bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
          📸 AI Photo Analysis {!isPremium() && <span className="text-sm text-orange-500 ml-2">⭐ Premium</span>}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {isPremium() 
            ? 'Take a photo of your meal for instant AI nutrition analysis' 
            : 'Upgrade to Premium to unlock AI-powered photo analysis'}
        </p>
        
        <div className="flex gap-3">
          <button 
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center"
            onClick={() => handlePhotoUpload(CameraSource.Camera)}
            disabled={isAnalyzing}
          >
            <Camera size={20} className="mr-2" />
            {isAnalyzing ? 'Analyzing...' : 'Take Photo'}
          </button>
          
          <button 
            className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center"
            onClick={() => handlePhotoUpload(CameraSource.Photos)}
            disabled={isAnalyzing}
          >
            <Upload size={20} className="mr-2" />
            Upload from Library
          </button>
        </div>

        {selectedImage && (
          <div className="mt-4">
            <img src={selectedImage} alt="Selected meal" className="w-full max-h-64 object-cover rounded-xl" />
          </div>
        )}
      </div>

      {/* Barcode Scanner Section - Free */}
      <div className="mb-6 bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
          🔍 Barcode Scanner <span className="text-sm text-green-500 ml-2">Free</span>
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Scan product barcodes for instant nutrition info
        </p>
        
        <button 
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center"
          onClick={handleBarcodeScanner}
          disabled={scanning}
        >
          <Barcode size={20} className="mr-2" />
          {scanning ? 'Scanning...' : 'Scan Barcode'}
        </button>
      </div>

      {/* Manual Entry Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Manual Entry</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Meal Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={mealData.name}
              onChange={handleInputChange}
              placeholder="e.g., Chicken Salad"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="calories" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Calories *
              </label>
              <input
                type="number"
                id="calories"
                name="calories"
                value={mealData.calories}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                required
              />
            </div>

            <div>
              <label htmlFor="protein" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Protein (g)
              </label>
              <input
                type="number"
                id="protein"
                name="protein"
                value={mealData.protein}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                step="0.1"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="carbs" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Carbs (g)
              </label>
              <input
                type="number"
                id="carbs"
                name="carbs"
                value={mealData.carbs}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                step="0.1"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="fat" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fat (g)
              </label>
              <input
                type="number"
                id="fat"
                name="fat"
                value={mealData.fat}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                step="0.1"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button 
            type="button" 
            className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            onClick={handleSaveAsFavourite}
          >
            ❤️ Save as Favourite
          </button>
          <button 
            type="submit" 
            className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-semibold hover:shadow-lg transition"
          >
            ✅ Log Meal
          </button>
        </div>
      </form>

      {/* Premium Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowPremiumModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 text-center">⭐ Premium Feature</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
              AI photo analysis is a premium feature. Upgrade to Premium to unlock:
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <span className="text-green-500 mr-3 text-xl">✓</span>
                AI-powered photo analysis
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <span className="text-green-500 mr-3 text-xl">✓</span>
                Unlimited favourite meals
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <span className="text-green-500 mr-3 text-xl">✓</span>
                6 months of history
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <span className="text-green-500 mr-3 text-xl">✓</span>
                Advanced analytics
              </li>
            </ul>
            <div className="flex gap-3">
              <button 
                className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl font-semibold"
                onClick={() => setShowPremiumModal(false)}
              >
                Close
              </button>
              <button 
                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold"
                onClick={() => {
                  setShowPremiumModal(false);
                  navigate('/account');
                }}
              >
                View Plans
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealAnalyzer;
