// Beermatik - Sıfırlama Butonu Komponenti

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
} from 'react-native';
import { triggerMediumHaptic } from '../utils/helpers';

interface ResetButtonProps {
  onReset: () => void;
  disabled?: boolean;
}

export const ResetButton: React.FC<ResetButtonProps> = ({
  onReset,
  disabled = false,
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleResetPress = async () => {
    try {
      await triggerMediumHaptic();
      setShowModal(true);
    } catch (error) {
      console.error('Haptic feedback hatası:', error);
      setShowModal(true);
    }
  };

  const handleConfirmReset = async () => {
    try {
      await triggerMediumHaptic();
      onReset();
      setShowModal(false);
    } catch (error) {
      console.error('Reset hatası:', error);
      onReset();
      setShowModal(false);
    }
  };

  const handleCancelReset = async () => {
    try {
      await triggerMediumHaptic();
      setShowModal(false);
    } catch (error) {
      console.error('Haptic feedback hatası:', error);
      setShowModal(false);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.resetButton, disabled && styles.resetButtonDisabled]}
        onPress={handleResetPress}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text style={[styles.resetButtonText, disabled && styles.resetButtonTextDisabled]}>
          🔄 Yeni Oturum
        </Text>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={handleCancelReset}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Yeni Oturum Başlat</Text>
            <Text style={styles.modalText}>
              Mevcut sayacı sıfırlamak istediğinizden emin misiniz?
              {'\n\n'}
              Bu işlem geri alınamaz ve tüm veriler silinecektir.
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelReset}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>İptal</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirmReset}
                activeOpacity={0.7}
              >
                <Text style={styles.confirmButtonText}>Sıfırla</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  resetButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 20,
    borderWidth: 2,
    borderColor: '#F44336',
  },
  
  resetButtonDisabled: {
    backgroundColor: 'rgba(244, 67, 54, 0.3)',
    borderColor: 'rgba(244, 67, 54, 0.3)',
  },
  
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  resetButtonTextDisabled: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  
  modalContent: {
    backgroundColor: '#000000',
    borderRadius: 20,
    padding: 30,
    width: '100%',
    maxWidth: 350,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  
  modalText: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#CCCCCC',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 20,
    flex: 1,
    marginRight: 10,
  },
  
  cancelButtonText: {
    color: '#CCCCCC',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  confirmButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 20,
    flex: 1,
    marginLeft: 10,
  },
  
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
