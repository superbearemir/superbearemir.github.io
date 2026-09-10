import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { 
  ShoppingBag, 
  Sparkles, 
  X, 
  Check, 
  Coins, 
  Zap, 
  Crown, 
  Wand2, 
  Gift, 
  Glasses,
  Flame,
  Search,
  RotateCcw,
  SlidersHorizontal,
  Shirt,
  Swords,
  Eye,
  RotateCw,
  Play,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Filter,
  CheckCircle2,
  PackageCheck,
  Grid,
  UserCheck
} from 'lucide-react';
import { getCurrentSavedDesign, syncShopEquipmentsToGameInstance } from '../customizer/GameBridge';
import { SHOP_ITEMS, ShopItem } from '../data/shopItemsData';
import { createCustomBear3D, BuiltBearModel } from '../customizer/3dBearBuilder';
import { buildHatMesh, buildFaceMesh, buildBackMesh, buildHandMesh } from '../customizer/equipmentMeshBuilder';
import { hexToInt } from '../customizer/ImageAnalyzer';
import { LootBoxModal } from './LootBoxModal';

interface CatMerchantShopModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type CategoryType = 'all' | 'hats' | 'face' | 'back' | 'skins' | 'hand' | 'auras' | 'potions';
type RarityType = 'all' | 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
type FilterStatusType = 'all' | 'equipped' | 'owned' | 'paid' | 'free';

export const CatMerchantShopModal: React.FC<CatMerchantShopModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<CategoryType>('all');
  const [selectedRarity, setSelectedRarity] = useState<RarityType>('all');
  const [filterStatus, setFilterStatus] = useState<FilterStatusType>('all');
  const [isLootBoxModalOpen, setIsLootBoxModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'name' | 'price_low' | 'price_high' | 'rarity'>('featured');
  const [bearPose, setBearPose] = useState<'idle' | 'dance' | 'roar' | 'punch' | 'wave' | 'spin'>('idle');
  const [mobileViewMode, setMobileViewMode] = useState<'catalog' | 'preview'>('catalog');
  const bearPoseRef = useRef(bearPose);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(12);
  const [jumpPageInput, setJumpPageInput] = useState<string>('');

  const [coins, setCoins] = useState<number>(() => {
    if (typeof window !== 'undefined' && (window as any).__superBearSaveManager) {
      return (window as any).__superBearSaveManager.getSaveData().goldBalance;
    }
    const saved = localStorage.getItem('super_bear_coins');
    if (!saved || parseInt(saved, 10) >= 900000) {
      localStorage.setItem('super_bear_coins', '150');
      return 150;
    }
    return parseInt(saved, 10);
  });
  
  const [purchasedIds, setPurchasedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('super_bear_purchased_items');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {}
    }
    const starterPurchased: string[] = [];
    localStorage.setItem('super_bear_purchased_items', JSON.stringify(starterPurchased));
    return starterPurchased;
  });
  
  const [equippedIds, setEquippedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('super_bear_equipped_items');
    if (!saved) {
      const defaultEquipped: string[] = [];
      localStorage.setItem('super_bear_equipped_items', JSON.stringify(defaultEquipped));
      return defaultEquipped;
    }
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        const cleaned = parsed.filter(id => id !== 'back_royal_cape');
        if (cleaned.length !== parsed.length) {
          localStorage.setItem('super_bear_equipped_items', JSON.stringify(cleaned));
        }
        return cleaned;
      }
    } catch (e) {}
    return [];
  });
  
  const [notice, setNotice] = useState<string | null>(null);

  // 3D Canvas Refs
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const bearModelRef = useRef<BuiltBearModel | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const orbitState = useRef({
    isDragging: false,
    prevX: 0,
    prevY: 0,
    rotY: 0.3,
    rotX: 0.15,
    distance: 6.2,
    targetY: 0.35,
  });

  // ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLootBoxModalOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLootBoxModalOpen, onClose]);

  // Sync state to localStorage & Game Instance
  useEffect(() => {
    localStorage.setItem('super_bear_coins', coins.toString());
    if (typeof window !== 'undefined' && (window as any).__superBearSaveManager) {
      (window as any).__superBearSaveManager.updateGold(coins);
    }
  }, [coins]);

  useEffect(() => {
    localStorage.setItem('super_bear_purchased_items', JSON.stringify(purchasedIds));
    if (typeof window !== 'undefined' && (window as any).__superBearSaveManager) {
      (window as any).__superBearSaveManager.saveGame({ shopPurchasedIds: purchasedIds }, { immediate: false });
    }
  }, [purchasedIds]);

  useEffect(() => {
    localStorage.setItem('super_bear_equipped_items', JSON.stringify(equippedIds));
    if (typeof window !== 'undefined' && (window as any).__superBearSaveManager) {
      (window as any).__superBearSaveManager.saveGame({ shopEquippedIds: equippedIds }, { immediate: true });
    }
    syncShopEquipmentsToGameInstance(equippedIds);
    update3DBearEquipments();
  }, [equippedIds]);

  // Listen for coins updated from other sources
  useEffect(() => {
    const handleCoinsUpdated = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && typeof detail.coins === 'number') {
        setCoins(detail.coins);
      }
    };
    window.addEventListener('superbear:coins-updated', handleCoinsUpdated);
    return () => {
      window.removeEventListener('superbear:coins-updated', handleCoinsUpdated);
    };
  }, []);

  const showNotification = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  };

  // Helper to update 3D Bear model equipments inside the studio canvas
  const update3DBearEquipments = useCallback((targetEquippedIds?: string[]) => {
    if (!bearModelRef.current) return;
    const activeIds = targetEquippedIds || equippedIds;
    const bearRoot = bearModelRef.current.root;
    const headGroup = bearModelRef.current.headGroup || bearRoot;
    const rightArmGroup = bearModelRef.current.rightArmGroup || bearRoot;
    const bodyMesh = bearModelRef.current.bodyMesh || bearRoot;
    if (!bearRoot) return;

    // 1. Hat container
    let hatContainer = headGroup.getObjectByName('preview_hat_container');
    if (!hatContainer) {
      hatContainer = new THREE.Group();
      hatContainer.name = 'preview_hat_container';
      if (bearModelRef.current.headGroup) {
        hatContainer.position.set(0, 0.42, 0.05);
      } else {
        hatContainer.position.set(0, 1.55, 0.05);
      }
      headGroup.add(hatContainer);
    }

    // 2. Face container
    let faceContainer = headGroup.getObjectByName('preview_face_container');
    if (!faceContainer) {
      faceContainer = new THREE.Group();
      faceContainer.name = 'preview_face_container';
      if (bearModelRef.current.headGroup) {
        faceContainer.position.set(0, -0.05, 0.45);
      } else {
        faceContainer.position.set(0, 1.35, 0.38);
      }
      headGroup.add(faceContainer);
    }

    // 3. Back container
    let backContainer = bodyMesh.getObjectByName('preview_back_container');
    if (!backContainer) {
      backContainer = new THREE.Group();
      backContainer.name = 'preview_back_container';
      if (bearModelRef.current.bodyMesh) {
        backContainer.position.set(0, 0.1, -0.42);
      } else {
        backContainer.position.set(0, 0.7, -0.42);
      }
      bodyMesh.add(backContainer);
    }

    // 4. Hand container
    let handContainer = rightArmGroup.getObjectByName('preview_hand_container');
    if (!handContainer) {
      handContainer = new THREE.Group();
      handContainer.name = 'preview_hand_container';
      if (bearModelRef.current.rightArmGroup) {
        handContainer.position.set(0, -0.38, 0.15);
      } else {
        handContainer.position.set(0.45, 0.5, 0.25);
      }
      rightArmGroup.add(handContainer);
    }

    // Clear existing children
    [hatContainer, faceContainer, backContainer, handContainer].forEach(container => {
      if (container && container.children) {
        while (container.children.length > 0) {
          container.remove(container.children[0]);
        }
      }
    });

    const design = getCurrentSavedDesign();

    // Attach active items
    activeIds.forEach(id => {
      const itemData = SHOP_ITEMS.find(item => item.id === id);
      const colorInt = itemData?.color ? hexToInt(itemData.color) : 0xf59e0b;

      if (itemData) {
        if (itemData.slot === 'hat' && hatContainer) {
          hatContainer.add(buildHatMesh(id, colorInt));
        } else if (itemData.slot === 'face' && faceContainer) {
          faceContainer.add(buildFaceMesh(id, colorInt));
        } else if (itemData.slot === 'back' && backContainer) {
          backContainer.add(buildBackMesh(id, colorInt));
        } else if (itemData.slot === 'hand' && handContainer) {
          handContainer.add(buildHandMesh(id, colorInt));
        } else if (itemData.slot === 'skin') {
          if (id.includes('gold')) {
            design.palette.furColor = '#f59e0b';
            design.palette.bellyColor = '#fef08a';
            design.materialType = 'gold';
          } else if (id.includes('magma')) {
            design.palette.furColor = '#b91c1c';
            design.palette.bellyColor = '#f97316';
            design.materialType = 'magma';
          } else if (id.includes('cyber')) {
            design.palette.furColor = '#0284c7';
            design.palette.bellyColor = '#38bdf8';
            design.materialType = 'cyber';
          } else if (itemData.color) {
            design.palette.furColor = itemData.color;
          }
        }
      } else {
        if ((id.includes('hat') || id.includes('crown') || id.includes('ears')) && hatContainer) {
          hatContainer.add(buildHatMesh(id, 0xf59e0b));
        } else if ((id.includes('glasses') || id.includes('face') || id.includes('mask')) && faceContainer) {
          faceContainer.add(buildFaceMesh(id, 0x0f172a));
        } else if ((id.includes('cape') || id.includes('back') || id.includes('wing')) && backContainer) {
          backContainer.add(buildBackMesh(id, 0x3b82f6));
        } else if ((id.includes('sword') || id.includes('staff') || id.includes('hand')) && handContainer) {
          handContainer.add(buildHandMesh(id, 0xeab308));
        }
      }
    });

    bearModelRef.current.updateDesign(design);
  }, [equippedIds]);

  // Setup 3D Scene for live bear preview inside modal
  useEffect(() => {
    if (!isOpen || !canvasContainerRef.current) return;
    const container = canvasContainerRef.current;
    const width = container.clientWidth || 340;
    const height = container.clientHeight || 300;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1d);
    sceneRef.current = scene;

    // Grid Floor
    const grid = new THREE.GridHelper(12, 24, 0x3b82f6, 0x1e293b);
    grid.position.y = 0;
    scene.add(grid);

    // Platform Pedestal for Bear
    const pedestalMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.8 });
    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.4, 0.2, 32), pedestalMat);
    pedestal.position.y = 0.1;
    scene.add(pedestal);

    const ringMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.03, 8, 32), ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.21;
    scene.add(ring);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / Math.max(height, 1), 0.1, 100);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfffae0, 1.8);
    dirLight.position.set(4, 8, 5);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const blueRimLight = new THREE.DirectionalLight(0x38bdf8, 1.5);
    blueRimLight.position.set(-4, 4, -4);
    scene.add(blueRimLight);

    const goldPointLight = new THREE.PointLight(0xf59e0b, 2.0, 8);
    goldPointLight.position.set(0, 2, 2);
    scene.add(goldPointLight);

    // 5. Create 3D Bear Model
    const initialDesign = getCurrentSavedDesign();
    const bearModel = createCustomBear3D(initialDesign);
    scene.add(bearModel.root);
    bearModelRef.current = bearModel;

    // Apply initial equipped items to the bear
    update3DBearEquipments();

    // 6. Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Camera Orbit
      const orbit = orbitState.current;
      const x = orbit.distance * Math.sin(orbit.rotY) * Math.cos(orbit.rotX);
      const y = orbit.targetY + orbit.distance * Math.sin(orbit.rotX);
      const z = orbit.distance * Math.cos(orbit.rotY) * Math.cos(orbit.rotX);
      camera.position.set(x, y, z);
      camera.lookAt(0, orbit.targetY, 0);

      // Animation poses
      const model = bearModelRef.current;
      if (model) {
        const pose = bearPoseRef.current;
        if (pose === 'idle') {
          if (model.headGroup) model.headGroup.rotation.y = Math.sin(time * 1.5) * 0.12;
          if (model.headGroup) model.headGroup.rotation.x = Math.sin(time * 2.0) * 0.05;
          if (model.bodyMesh) model.bodyMesh.position.y = 0.75 + Math.sin(time * 3.0) * 0.03;
          if (model.leftArmGroup) model.leftArmGroup.rotation.x = Math.sin(time * 2.0) * 0.1;
          if (model.rightArmGroup) model.rightArmGroup.rotation.x = -Math.sin(time * 2.0) * 0.1;
        } else if (pose === 'dance') {
          model.root.rotation.y = Math.sin(time * 4) * 0.35;
          if (model.bodyMesh) model.bodyMesh.position.y = 0.75 + Math.abs(Math.sin(time * 6)) * 0.2;
          if (model.leftArmGroup) model.leftArmGroup.rotation.z = Math.sin(time * 6) * 0.8 + 0.4;
          if (model.rightArmGroup) model.rightArmGroup.rotation.z = -Math.sin(time * 6) * 0.8 - 0.4;
        } else if (pose === 'roar') {
          if (model.headGroup) {
            model.headGroup.rotation.x = -0.35 + Math.sin(time * 8) * 0.05;
            model.headGroup.rotation.y = Math.sin(time * 12) * 0.08;
          }
          if (model.leftArmGroup) model.leftArmGroup.rotation.x = -1.2 + Math.sin(time * 8) * 0.1;
          if (model.rightArmGroup) model.rightArmGroup.rotation.x = -1.2 - Math.sin(time * 8) * 0.1;
        } else if (pose === 'punch') {
          if (model.rightArmGroup) {
            model.rightArmGroup.rotation.x = -1.5 + Math.sin(time * 10) * 0.8;
            model.rightArmGroup.rotation.y = Math.sin(time * 10) * 0.4;
          }
        } else if (pose === 'wave') {
          if (model.rightArmGroup) {
            model.rightArmGroup.rotation.x = -1.6;
            model.rightArmGroup.rotation.z = Math.sin(time * 8) * 0.5 - 0.3;
          }
        } else if (pose === 'spin') {
          model.root.rotation.y = time * 3.5;
          if (model.bodyMesh) model.bodyMesh.position.y = 0.75 + Math.sin(time * 6) * 0.1;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || 340;
      const h = container.clientHeight || 300;
      camera.aspect = w / Math.max(h, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      renderer.dispose();
    };
  }, [isOpen, mobileViewMode, update3DBearEquipments]);

  // Sync bear pose
  useEffect(() => {
    bearPoseRef.current = bearPose;
  }, [bearPose]);

  // Pointer/Mouse Orbit Events
  const handleMouseDown = (e: React.MouseEvent) => {
    orbitState.current.isDragging = true;
    orbitState.current.prevX = e.clientX;
    orbitState.current.prevY = e.clientY;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!orbitState.current.isDragging) return;
    const deltaX = e.clientX - orbitState.current.prevX;
    const deltaY = e.clientY - orbitState.current.prevY;
    orbitState.current.prevX = e.clientX;
    orbitState.current.prevY = e.clientY;

    orbitState.current.rotY -= deltaX * 0.01;
    orbitState.current.rotX = Math.max(-0.4, Math.min(0.7, orbitState.current.rotX + deltaY * 0.01));
  };

  const handleMouseUp = () => {
    orbitState.current.isDragging = false;
  };

  // Touch Orbit Events for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      orbitState.current.isDragging = true;
      orbitState.current.prevX = e.touches[0].clientX;
      orbitState.current.prevY = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!orbitState.current.isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - orbitState.current.prevX;
    const deltaY = e.touches[0].clientY - orbitState.current.prevY;
    orbitState.current.prevX = e.touches[0].clientX;
    orbitState.current.prevY = e.touches[0].clientY;

    orbitState.current.rotY -= deltaX * 0.012;
    orbitState.current.rotX = Math.max(-0.4, Math.min(0.7, orbitState.current.rotX + deltaY * 0.012));
  };

  // Buy or Equip Item
  const handleBuyOrEquip = (item: ShopItem) => {
    const isOwned = purchasedIds.includes(item.id);
    const isEquipped = equippedIds.includes(item.id);

    if (isEquipped) {
      // Unequip item
      const nextEquipped = equippedIds.filter(id => id !== item.id);
      setEquippedIds(nextEquipped);
      showNotification(`ℹ️ "${item.name}" çıkarıldı.`);
      return;
    }

    if (isOwned) {
      // Equip item: Filter out items in same slot if single slot
      const otherEquipped = equippedIds.filter(id => {
        const otherItem = SHOP_ITEMS.find(i => i.id === id);
        return otherItem?.slot !== item.slot;
      });
      const nextEquipped = [...otherEquipped, item.id];
      setEquippedIds(nextEquipped);
      showNotification(`✨ "${item.name}" kuşanıldı & karaktere giydirildi!`);
      return;
    }

    // Purchase & Equip
    if (coins < item.price) {
      showNotification(`❌ Yetersiz Altın! ${item.price} 🪙 gerekiyor.`);
      return;
    }

    const nextCoins = coins - item.price;
    setCoins(nextCoins);
    const nextPurchased = [...purchasedIds, item.id];
    setPurchasedIds(nextPurchased);

    const otherEquipped = equippedIds.filter(id => {
      const otherItem = SHOP_ITEMS.find(i => i.id === id);
      return otherItem?.slot !== item.slot;
    });
    const nextEquipped = [...otherEquipped, item.id];
    setEquippedIds(nextEquipped);

    showNotification(`🎉 "${item.name}" satın alındı ve kuşanıldı! (-${item.price} 🪙)`);
  };

  const handleUnequipAll = () => {
    setEquippedIds([]);
    showNotification('🧹 Tüm kostüm ve aksesuarlar çıkarıldı.');
  };

  const handleFreeCoins = () => {
    const nextCoins = coins + 2000;
    setCoins(nextCoins);
    showNotification('🎁 +2,000 Altın hesabına eklendi!');
  };

  // Category counts map
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: SHOP_ITEMS.length };
    SHOP_ITEMS.forEach(item => {
      const cat = (item.category as string) === 'aliens' ? 'potions' : item.category;
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, []);

  // Process items: Filter -> Status -> Search -> Sort
  const processedItems = useMemo(() => {
    let list = SHOP_ITEMS.filter(item => {
      const matchesTab = activeTab === 'all' || item.category === activeTab || (activeTab === 'potions' && ((item.category as string) === 'potions' || (item.category as string) === 'aliens'));
      const matchesRarity = selectedRarity === 'all' || item.rarity === selectedRarity;
      
      let matchesStatus = true;
      if (filterStatus === 'equipped') {
        matchesStatus = equippedIds.includes(item.id);
      } else if (filterStatus === 'owned') {
        matchesStatus = purchasedIds.includes(item.id);
      } else if (filterStatus === 'paid') {
        matchesStatus = item.price > 0;
      } else if (filterStatus === 'free') {
        matchesStatus = item.price === 0;
      }

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        item.name.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query) ||
        item.slot.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        (item.rarity && item.rarity.toLowerCase().includes(query));

      return matchesTab && matchesRarity && matchesStatus && matchesSearch;
    });

    if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
    } else if (sortBy === 'price_low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rarity') {
      const rarityRank = { mythic: 5, legendary: 4, epic: 3, rare: 2, common: 1 };
      list.sort((a, b) => (rarityRank[b.rarity || 'common'] || 0) - (rarityRank[a.rarity || 'common'] || 0));
    }

    return list;
  }, [activeTab, selectedRarity, filterStatus, searchQuery, sortBy, equippedIds, purchasedIds]);

  // Reset page on filter/search changes
  useEffect(() => {
    setCurrentPage(1);
    setJumpPageInput('');
  }, [activeTab, selectedRarity, filterStatus, searchQuery, sortBy, itemsPerPage]);

  const totalItems = processedItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const validPage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex = totalItems === 0 ? 0 : (validPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedItems = processedItems.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage: number) => {
    const target = Math.min(Math.max(1, newPage), totalPages);
    setCurrentPage(target);
  };

  const handleClearFilters = () => {
    setActiveTab('all');
    setSelectedRarity('all');
    setFilterStatus('all');
    setSearchQuery('');
    setSortBy('featured');
    setCurrentPage(1);
  };

  const getPaginationPages = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (validPage > 3) {
        pages.push('...');
      }
      const start = Math.max(2, validPage - 1);
      const end = Math.min(totalPages - 1, validPage + 1);
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      if (validPage < totalPages - 2) {
        pages.push('...');
      }
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  const getRarityBadge = (rarity?: string) => {
    switch (rarity) {
      case 'mythic':
        return <span className="px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-400/50 font-black text-[9px] sm:text-[10px]">MİTİK 🌟</span>;
      case 'legendary':
        return <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/50 font-black text-[9px] sm:text-[10px]">EFSANEVİ 👑</span>;
      case 'epic':
        return <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-400/50 font-black text-[9px] sm:text-[10px]">SÜPER ENDER ⚡</span>;
      case 'rare':
        return <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/50 font-black text-[9px] sm:text-[10px]">ENDER 💎</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded bg-slate-700/80 text-slate-300 border border-slate-600 font-bold text-[9px] sm:text-[10px]">YAYGIN ☘️</span>;
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-1 sm:p-3 animate-in fade-in duration-200 select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLootBoxModalOpen) {
          onClose();
        }
      }}
    >
      {/* Modal Container */}
      <div className="relative w-full max-w-7xl bg-slate-900 border-2 border-amber-500/80 rounded-3xl shadow-2xl flex flex-col h-[96dvh] max-h-[96vh] overflow-hidden">
        
        {/* Header Bar */}
        <div className="p-2.5 sm:p-3.5 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 text-slate-950 flex items-center justify-between border-b-2 border-amber-400/60 shrink-0 shadow-md">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-slate-950 border-2 border-amber-200 flex items-center justify-center text-lg sm:text-xl shadow-lg shrink-0">
              🐱
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h2 className="text-sm sm:text-lg font-black tracking-wider text-slate-950 line-clamp-1">
                  KEDİ CAPİ & AYI KOSTÜM MAĞAZASI
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-slate-950 text-amber-300 font-black text-[10px] sm:text-xs border border-amber-400/50 hidden xs:inline-block">
                  180+ İtem 🏪
                </span>
              </div>
              <p className="text-[11px] font-bold text-slate-950 opacity-90 hidden sm:block">
                İtemleri seç, karakter üzerinde anında canlı gör ve giydir!
              </p>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2">
            <div className="px-2.5 py-1 bg-slate-950/90 border border-amber-400 rounded-xl flex items-center gap-1 text-amber-300 font-black text-xs sm:text-sm shadow-inner">
              <Coins className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>{coins.toLocaleString()} 🪙</span>
            </div>

            <button
              onClick={onClose}
              className="min-w-[42px] min-h-[42px] p-2 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black transition active:scale-95 cursor-pointer border-2 border-rose-300 flex items-center justify-center shadow-lg"
              title="Kapat (ESC)"
              aria-label="Pencereyi Kapat"
            >
              <X className="w-6 h-6 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Quick Toolbar Bar */}
        <div className="px-3 py-1.5 bg-slate-950/95 border-b border-amber-500/30 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleFreeCoins}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] sm:text-xs rounded-xl border border-emerald-300 flex items-center gap-1 transition active:scale-95 cursor-pointer shadow"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>+2,000 Altın Al</span>
            </button>

            <button
              onClick={() => setIsLootBoxModalOpen(true)}
              className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-[11px] sm:text-xs rounded-xl border border-amber-200 flex items-center gap-1 transition active:scale-95 cursor-pointer shadow"
              title="Şans Kutularını Aç"
            >
              <Gift className="w-3.5 h-3.5 text-slate-950" />
              <span>🎁 ŞANS KUTULARI</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile View Mode Switcher (Visible on small screens < md) */}
            <div className="flex md:hidden items-center bg-slate-900 p-0.5 rounded-xl border border-slate-700">
              <button
                onClick={() => setMobileViewMode('catalog')}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition cursor-pointer flex items-center gap-1 ${
                  mobileViewMode === 'catalog'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Katalog</span>
              </button>
              <button
                onClick={() => setMobileViewMode('preview')}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition cursor-pointer flex items-center gap-1 ${
                  mobileViewMode === 'preview'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>3D Ayı ({equippedIds.length})</span>
              </button>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <div className="px-2.5 py-1 bg-slate-800 rounded-xl text-slate-300 text-xs font-bold flex items-center gap-1.5 border border-slate-700">
                <Shirt className="w-3.5 h-3.5 text-amber-400" />
                <span>Giyili: <strong className="text-amber-300">{equippedIds.length}</strong></span>
              </div>

              {equippedIds.length > 0 && (
                <button
                  onClick={handleUnequipAll}
                  className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/40 text-rose-300 font-bold text-xs rounded-xl flex items-center gap-1 transition cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Çıkar</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Notice Toast */}
        {notice && (
          <div className="mx-3 mt-1.5 p-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs text-center border border-amber-200 shadow-xl animate-in fade-in slide-in-from-top-2 shrink-0">
            {notice}
          </div>
        )}

        {/* Main Content Area: Left 3D Bear (hidden on mobile when in catalog mode), Right Catalog Grid */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          
          {/* LEFT PANEL: 3D Bear Character Studio Preview */}
          <div className={`${
            mobileViewMode === 'preview' ? 'flex' : 'hidden md:flex'
          } w-full md:w-[320px] lg:w-[360px] bg-slate-950 border-r border-slate-800 flex-col p-2.5 sm:p-3 shrink-0 relative overflow-y-auto`}>
            
            <div className="flex items-center justify-between mb-1.5 px-1">
              <div className="flex items-center gap-1.5 text-amber-300 font-black text-xs sm:text-sm">
                <Eye className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>CANLI 3D AYI ÖNİZLEME</span>
              </div>
              <span className="text-[10px] text-slate-400">Döndür / İncele</span>
            </div>

            {/* Three.js Canvas Container */}
            <div 
              ref={canvasContainerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
              className="w-full h-[200px] sm:h-[220px] md:h-[240px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl border border-amber-500/40 shadow-inner relative cursor-grab active:cursor-grabbing overflow-hidden shrink-0 touch-none"
            >
              <div className="absolute bottom-1.5 left-2 right-2 px-2.5 py-1 bg-slate-950/80 backdrop-blur-md rounded-xl border border-slate-800 text-[10px] text-slate-300 flex items-center justify-between pointer-events-none">
                <span>🔄 360° Çevir</span>
                <span className="text-amber-400 font-black">CANLI SENKRON</span>
              </div>
            </div>

            {/* Animation Pose Controls */}
            <div className="mt-2 p-2 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                <span className="flex items-center gap-1 text-amber-400">
                  <Play className="w-3 h-3" /> Hareket Duruşu:
                </span>
                <span className="text-[10px] text-slate-400 capitalize">{bearPose}</span>
              </div>

              <div className="grid grid-cols-3 gap-1">
                {[
                  { id: 'idle', label: '😌 Duruş' },
                  { id: 'dance', label: '💃 Dans' },
                  { id: 'roar', label: '🦁 Kükre' },
                  { id: 'punch', label: '🥊 Saldır' },
                  { id: 'wave', label: '👋 Selam' },
                  { id: 'spin', label: '🌪️ Dönüş' },
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => setBearPose(p.id as any)}
                    className={`py-1 rounded-xl text-[10px] font-black transition cursor-pointer ${
                      bearPose === p.id
                        ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                        : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Equipped Items List in Preview */}
            <div className="mt-2 p-2 bg-slate-900/90 rounded-2xl border border-slate-800 flex-1 min-h-[90px] flex flex-col">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 mb-1.5">
                <span className="flex items-center gap-1 text-amber-300">
                  <Shirt className="w-3.5 h-3.5" /> Şu An Takılı Olanlar ({equippedIds.length}):
                </span>
                {equippedIds.length > 0 && (
                  <button
                    onClick={handleUnequipAll}
                    className="text-[10px] text-rose-400 hover:text-rose-300 font-bold transition cursor-pointer"
                  >
                    Tümünü Çıkar
                  </button>
                )}
              </div>

              {equippedIds.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-[11px] text-slate-500 text-center py-2">
                  Henüz hiçbir kostüm veya aksesuar takılmadı.
                </div>
              ) : (
                <div className="flex flex-wrap gap-1 overflow-y-auto max-h-[110px] pr-1">
                  {equippedIds.map(id => {
                    const itm = SHOP_ITEMS.find(i => i.id === id);
                    if (!itm) return null;
                    return (
                      <div
                        key={id}
                        className="px-2 py-0.5 rounded-lg bg-amber-500/15 border border-amber-400/40 text-amber-200 text-[10px] font-bold flex items-center gap-1"
                      >
                        <span>{itm.name}</span>
                        <button
                          onClick={() => handleBuyOrEquip(itm)}
                          className="hover:text-rose-400 font-black cursor-pointer ml-0.5"
                          title="Çıkar"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Switch back to catalog button on mobile */}
            <button
              onClick={() => setMobileViewMode('catalog')}
              className="mt-2 md:hidden w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow transition cursor-pointer"
            >
              🛍️ İtem Kataloğuna Geri Dön
            </button>
          </div>

          {/* RIGHT PANEL: Shop Catalog & Filter Grid */}
          <div className={`${
            mobileViewMode === 'catalog' ? 'flex' : 'hidden md:flex'
          } flex-1 flex-col min-w-0 bg-slate-900/60 overflow-hidden`}>
            
            {/* Filter Toolbar Area */}
            <div className="p-2 sm:p-2.5 bg-slate-950/80 border-b border-slate-800/80 space-y-1.5 shrink-0">
              
              {/* Row 1: Search + Status Chips + Sort */}
              <div className="flex flex-wrap items-center justify-between gap-1.5">
                
                {/* Search Input */}
                <div className="relative flex-1 min-w-[140px] max-w-sm">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="İtem ara (isim, slot, özellik)..."
                    className="w-full pl-8 pr-7 py-1 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Status Chips */}
                <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
                  {[
                    { id: 'all', label: 'Tümü' },
                    { id: 'paid', label: '🪙 Paralı' },
                    { id: 'free', label: '🎁 Ücretsiz' },
                    { id: 'equipped', label: `✨ Takılı (${equippedIds.length})` },
                    { id: 'owned', label: `✅ Envanterim (${purchasedIds.length})` },
                  ].map(st => (
                    <button
                      key={st.id}
                      onClick={() => setFilterStatus(st.id as any)}
                      className={`px-2 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer whitespace-nowrap ${
                        filterStatus === st.id
                          ? 'bg-amber-500 text-slate-950 font-black shadow'
                          : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-1 text-[11px] text-slate-400 shrink-0">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-slate-900 border border-slate-700 text-amber-300 font-bold rounded-lg px-2 py-1 text-[11px] focus:outline-none focus:border-amber-500"
                  >
                    <option value="featured">✨ Öne Çıkan</option>
                    <option value="price_low">🪙 Fiyat (Artan)</option>
                    <option value="price_high">🪙 Fiyat (Azalan)</option>
                    <option value="rarity">👑 Nadirlik</option>
                    <option value="name">🔤 İsim (A-Z)</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Category Tabs Scrollbar */}
              <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-thin">
                {[
                  { id: 'all', label: `Tümü (${categoryCounts.all || 0})`, icon: SlidersHorizontal },
                  { id: 'skins', label: `👑 Zırh & Deri (${categoryCounts.skins || 0})`, icon: Crown },
                  { id: 'hand', label: `⚔️ Silah (${categoryCounts.hand || 0})`, icon: Swords },
                  { id: 'hats', label: `🧙‍♂️ Şapkalar (${categoryCounts.hats || 0})`, icon: Wand2 },
                  { id: 'face', label: `🕶️ Yüz (${categoryCounts.face || 0})`, icon: Glasses },
                  { id: 'back', label: `🎒 Sırt & Pelerin (${categoryCounts.back || 0})`, icon: Shirt },
                  { id: 'auras', label: `✨ Auralar (${categoryCounts.auras || 0})`, icon: Flame },
                  { id: 'potions', label: `🧪 İksirler (${categoryCounts.potions || 0})`, icon: Zap },
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveTab(cat.id as any)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-black transition cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                      activeTab === cat.id
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Results Count & Sub-bar */}
            <div className="px-3 py-1 bg-slate-950/50 border-b border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
              <span className="font-bold text-slate-300">
                Gösterilen: <strong className="text-amber-300">{totalItems === 0 ? 0 : startIndex + 1}-{endIndex}</strong> / <strong className="text-amber-300">{totalItems}</strong> İtem
              </span>

              <div className="flex items-center gap-2">
                <span className="text-slate-400">
                  Sayfa <strong className="text-amber-300">{validPage}</strong> / {totalPages}
                </span>

                {/* Items Per Page */}
                <div className="hidden sm:flex items-center gap-1 text-[10px]">
                  <span>Adet:</span>
                  {[12, 18, 24].map(s => (
                    <button
                      key={s}
                      onClick={() => setItemsPerPage(s)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        itemsPerPage === s ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Item Catalog Grid (Dedicated Scroll Container) */}
            <div className="p-2 sm:p-3 overflow-y-auto flex-1 min-h-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5 text-slate-100 scrollbar-thin">
              {paginatedItems.length === 0 ? (
                <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400 gap-2.5">
                  <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-2xl">
                    🔍
                  </div>
                  <div className="text-center">
                    <p className="font-black text-xs sm:text-sm text-amber-200">Aradığınız kriterlere uygun item bulunamadı.</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Arama terimini değiştirmeyi veya filtreleri temizlemeyi deneyin.</p>
                  </div>
                  <button
                    onClick={handleClearFilters}
                    className="px-3.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs rounded-xl border border-amber-400/40 transition cursor-pointer"
                  >
                    🧹 Tüm Filtreleri Temizle
                  </button>
                </div>
              ) : (
                paginatedItems.map(item => {
                  const isOwned = purchasedIds.includes(item.id);
                  const isEquipped = equippedIds.includes(item.id);

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleBuyOrEquip(item)}
                      className={`p-2.5 sm:p-3 rounded-2xl border flex flex-col justify-between transition-all duration-150 relative overflow-hidden cursor-pointer select-none active:scale-[0.98] ${
                        isEquipped
                          ? 'bg-amber-950/60 border-amber-400 shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/80'
                          : isOwned
                          ? 'bg-slate-900/90 border-emerald-500/60 hover:border-emerald-400'
                          : 'bg-slate-900/60 border-slate-800 hover:border-amber-500/40'
                      }`}
                    >
                      <div>
                        {/* Header: Title, Rarity & Price */}
                        <div className="flex items-start justify-between gap-1.5 mb-1.5">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-black text-xs sm:text-sm text-amber-200 leading-tight truncate">
                              {item.name}
                            </h3>
                            <div className="mt-1 flex items-center gap-1 flex-wrap">
                              {getRarityBadge(item.rarity)}
                              <span className="text-[9px] text-slate-400 font-mono capitalize bg-slate-950/60 px-1 py-0.5 rounded border border-slate-800">
                                {item.slot}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 bg-amber-500/15 border border-amber-400/30 px-2 py-0.5 rounded-lg text-amber-300 font-black text-xs shrink-0">
                            <span>{item.price === 0 ? 'Ücretsiz' : `${item.price} 🪙`}</span>
                          </div>
                        </div>

                        <p className="text-[10px] sm:text-[11px] text-slate-300 font-medium mb-2 leading-tight line-clamp-2">
                          {item.description}
                        </p>
                      </div>

                      {/* Action Row */}
                      <div className="flex items-center justify-between pt-1.5 border-t border-slate-800/80">
                        <span className="text-[9px] sm:text-[10px] font-bold text-slate-400">
                          {isEquipped ? '✨ Karakterde Giydirildi' : isOwned ? '✅ Envanterinde' : '🛒 Satın Alınabilir'}
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBuyOrEquip(item);
                          }}
                          className={`px-2.5 py-1 rounded-xl font-black text-[11px] sm:text-xs flex items-center gap-1 transition active:scale-95 cursor-pointer shadow ${
                            isEquipped
                              ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 ring-1 ring-amber-300'
                              : isOwned
                              ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                              : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950'
                          }`}
                        >
                          {isEquipped ? (
                            <>
                              <Check className="w-3 h-3 stroke-[3]" />
                              <span>Çıkar</span>
                            </>
                          ) : isOwned ? (
                            <>
                              <Sparkles className="w-3 h-3 animate-spin" />
                              <span>Dene & Giydir</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3 h-3" />
                              <span>{item.price === 0 ? 'Bedava Al' : `${item.price} 🪙 Al`}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination Controls Bar */}
            <div className="p-2 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-1.5 text-xs shrink-0">
              
              {/* Page Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={validPage === 1}
                  className="p-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                  title="İlk Sayfa"
                >
                  <ChevronsLeft className="w-3.5 h-3.5 text-amber-400" />
                </button>

                <button
                  onClick={() => handlePageChange(validPage - 1)}
                  disabled={validPage === 1}
                  className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer flex items-center gap-0.5 font-bold text-xs"
                >
                  <ChevronLeft className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Önceki</span>
                </button>

                <div className="flex items-center gap-1 mx-0.5">
                  {getPaginationPages().map((page, idx) => {
                    if (typeof page === 'string') {
                      return (
                        <span key={`ellipsis-${idx}`} className="px-1 text-slate-500 font-bold text-xs">
                          ...
                        </span>
                      );
                    }

                    const isActive = page === validPage;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`min-w-[28px] h-[26px] px-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                          isActive
                            ? 'bg-amber-500 text-slate-950 shadow ring-1 ring-amber-300'
                            : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(validPage + 1)}
                  disabled={validPage === totalPages}
                  className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer flex items-center gap-0.5 font-bold text-xs"
                >
                  <span className="hidden sm:inline">Sonraki</span>
                  <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                </button>

                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={validPage === totalPages}
                  className="p-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                  title="Son Sayfa"
                >
                  <ChevronsRight className="w-3.5 h-3.5 text-amber-400" />
                </button>
              </div>

              {/* Direct Jump */}
              <form
                onSubmit={e => {
                  e.preventDefault();
                  const targetNum = parseInt(jumpPageInput, 10);
                  if (!isNaN(targetNum)) {
                    handlePageChange(targetNum);
                    setJumpPageInput('');
                  }
                }}
                className="flex items-center gap-1 text-slate-400 text-[11px] font-bold"
              >
                <span>Git:</span>
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  placeholder={validPage.toString()}
                  value={jumpPageInput}
                  onChange={e => setJumpPageInput(e.target.value)}
                  className="w-10 px-1 py-0.5 bg-slate-900 border border-slate-700 rounded text-center text-amber-300 font-bold text-xs focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="px-2 py-0.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 rounded font-bold transition cursor-pointer"
                >
                  Git
                </button>
              </form>

            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-2 sm:p-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <span className="hidden sm:inline">🐱 Bakkal Kedi Capi • {SHOP_ITEMS.length} Kostüm & İtem • Canlı 3D Önizleme</span>
          <span className="sm:hidden">🐱 {SHOP_ITEMS.length} İtem</span>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-rose-600 text-white rounded-xl font-black text-xs transition cursor-pointer border border-slate-700 shadow"
          >
            Kapat ve Oyuna Dön
          </button>
        </div>

      </div>

      {/* Standalone Loot Box Opening Modal with Animations & 4 Bundles */}
      <LootBoxModal
        isOpen={isLootBoxModalOpen}
        onClose={() => setIsLootBoxModalOpen(false)}
        playerGold={coins}
        onGoldChange={setCoins}
        purchasedIds={purchasedIds}
        onItemsPurchased={setPurchasedIds}
      />

    </div>
  );
};
